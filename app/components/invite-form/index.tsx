import React, { useState } from "react";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import {
  API_URL,
  FAILED_MSG,
  INPUT_ERROR_STYLES,
  INPUT_LABEL_STYLES,
  INPUT_STYLES,
  SUCCESS_MSG_TITLE,
} from "./constants";

// Define the form values interface
interface InviteFormValues {
  fullName: string;
  email: string;
  confirmEmail: string;
}

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required("Full Name is required")
    .min(3, "Full Name must be at least 3 characters"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  confirmEmail: Yup.string()
    .required("Please confirm your email")
    .oneOf([Yup.ref("email")], "Emails must match"), // Matches the email field
});

enum FormStatus {
  NOT_SUBMITED = "NOT_SUBMITED",
  FAILED = "FAILED",
  SUCCESS = "SUCCESS",
}

const InviteFormInput = ({
  label,
  ...props
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  isDisabled: boolean;
}) => {
  const [field, meta] = useField(props);
  return (
    <div className="mb-4">
      <label htmlFor={props.name} className={INPUT_LABEL_STYLES}>
        {label}
      </label>
      <input
        className={INPUT_STYLES}
        {...field}
        {...props}
        id={props.name}
        disabled={props.isDisabled}
      />
      {meta.touched && meta.error && (
        <div className={INPUT_ERROR_STYLES}>{meta.error}</div>
      )}
    </div>
  );
};

interface Props {
  onClose: () => void;
  initInviteFormValues?: InviteFormValues;
}

const InviteForm: React.FC<Props> = ({
  onClose,
  initInviteFormValues = { fullName: "", email: "", confirmEmail: "" },
}) => {
  const [formStatus, setFormStatus] = useState<FormStatus>(
    FormStatus.NOT_SUBMITED
  );

  return (
    <section className="py-6 px-4">
      {formStatus != FormStatus.SUCCESS ? (
        <Formik
          initialValues={initInviteFormValues}
          validationSchema={validationSchema}
          onSubmit={async (values: InviteFormValues, { setSubmitting }) => {
            // This callback will only execute if formValues passes yup validation
            const requestData = {
              name: values.fullName,
              email: values.email,
            };

            try {
              const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
              });

              // Success if the response is 200 (OK)
              setFormStatus(
                response.ok ? FormStatus.SUCCESS : FormStatus.FAILED
              );
            } catch (error) {
              // Handle network errors or other issues
              setFormStatus(FormStatus.FAILED);
              console.error(error);
            } finally {
              setSubmitting(false); // Always set submitting to false
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <h2 className="text-xl font-semibold mb-8 text-center">
                Request an Invite
              </h2>

              <InviteFormInput
                label={"Full Name"}
                name={"fullName"}
                type={"text"}
                placeholder={"John Doe"}
                isDisabled={isSubmitting}
              />

              <InviteFormInput
                label={"Email"}
                name={"email"}
                type={"email"}
                placeholder={"jd@airwallex.com"}
                isDisabled={isSubmitting}
              />

              <InviteFormInput
                label={"Confirm Email"}
                name={"confirmEmail"}
                type={"email"}
                placeholder={"jd@airwallex.com"}
                isDisabled={isSubmitting}
              />

              <button
                type="submit"
                className={`w-full mt-8 py-2 px-4 rounded-md transition-colors duration-200 ${
                  isSubmitting
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-accent text-white hover:bg-highlight"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send"}
              </button>

              {formStatus === FormStatus.FAILED && (
                <div className="text-red-600 text-sm mt-2">{FAILED_MSG}</div>
              )}
            </Form>
          )}
        </Formik>
      ) : (
        <div className="flex flex-col items-center justify-cente text-center">
          <h1 className="text-2xl font-bold mb-8 tracking-wide">
            {SUCCESS_MSG_TITLE}
          </h1>
          <p className="text-lg mb-8">
            Thank you for signing up. We are excited to have you on board!
          </p>
          <button
            className="w-full py-2 px-4 rounded-md transition-colors duration-200 bg-accent text-white hover:bg-highlight"
            onClick={() => onClose()}
          >
            Close
          </button>
        </div>
      )}
    </section>
  );
};

export default InviteForm;
