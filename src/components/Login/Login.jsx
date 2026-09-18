import {
  Button,
  Field,
  Input,
  Stack,
  Text,
  Link,
  HStack,
} from "@chakra-ui/react";
import { PasswordInput } from "../../src/components/ui/password-input";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login({ user = () => {} }) {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    setSubmitError("");
    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          expiresInMins: 30,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }
      sessionStorage.setItem("Auth", JSON.stringify(result));
      navigate("/");
    } catch (error) {
      setSubmitError(error.message || "Login failed");
    }
  });

  return (
    <form onSubmit={onSubmit} style={{ width: "100%" }}>
      <Stack gap="4" w={{ base: "80%", md: "80%px" }} m={"auto"}>
        <Field.Root invalid={!!errors.username}>
          <Field.Label>Username</Field.Label>
          <Input
            borderColor={"black"}
            {...register("username", { required: "Username is required" })}
          />
          <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.password}>
          <Field.Label>Password</Field.Label>
          <PasswordInput
            borderColor={"black"}
            {...register("password", { required: "Password is required" })}
          />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>

        {submitError ? (
          <Text color="red.500" fontSize="14px">
            {submitError}
          </Text>
        ) : null}

        <HStack gap={"30px"}>
          <Button type="submit" loading={isSubmitting}>
            Login
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/")}>
            Guest
          </Button>
        </HStack>

        <Text fontSize={"14px"}>
          Create an account{" "}
          <Link onClick={() => user((t) => !t)}>
            <Text fontWeight={"bold"}>SIGN UP</Text>
          </Link>
        </Text>
      </Stack>
    </form>
  );
}
