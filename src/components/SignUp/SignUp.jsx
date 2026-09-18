import { Button, Field, Input, Stack, Text, Link } from "@chakra-ui/react";
import { PasswordInput } from "../../src/components/ui/password-input";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function SignUp({ user = () => {} }) {
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const onSubmit = handleSubmit(async (data) => {
    setSubmitError("");
    try {
      const response = await fetch("https://dummyjson.com/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.fullName,
          email: data.email,
          address: { address: data.address },
          password: data.password,
        }),
      });
      if (!response.ok) {
        throw new Error("Sign up failed");
      }
      user(true);
    } catch (error) {
      setSubmitError(error.message || "Sign up failed");
    }
  });

  return (
    <form onSubmit={onSubmit} style={{ width: "100%" }}>
      <Stack gap="4" w={{ base: "80%", md: "80%px" }} m={"auto"}>
        <Field.Root invalid={!!errors.fullName}>
          <Field.Label>Full Name</Field.Label>
          <Input
            borderColor={"black"}
            {...register("fullName", { required: "Full name is required" })}
          />
          <Field.ErrorText>{errors.fullName?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.email}>
          <Field.Label>Email</Field.Label>
          <Input
            borderColor={"black"}
            type="email"
            {...register("email", { required: "Email is required" })}
          />
          <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.address}>
          <Field.Label>Address</Field.Label>
          <Input
            borderColor={"black"}
            {...register("address", { required: "Address is required" })}
          />
          <Field.ErrorText>{errors.address?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.password}>
          <Field.Label>Password</Field.Label>
          <PasswordInput
            borderColor={"black"}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "At least 6 characters" },
            })}
          />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.confirmPassword}>
          <Field.Label>Re-Enter Password</Field.Label>
          <PasswordInput
            borderColor={"black"}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
        </Field.Root>

        {submitError ? (
          <Text color="red.500" fontSize="14px">
            {submitError}
          </Text>
        ) : null}

        <Button type="submit" loading={isSubmitting}>
          SignUp
        </Button>
        <Text fontSize={"14px"}>
          Already have an account{" "}
          <Link onClick={() => user(true)}>
            <Text fontWeight={"bold"}>LOGIN</Text>
          </Link>
        </Text>
      </Stack>
    </form>
  );
}
