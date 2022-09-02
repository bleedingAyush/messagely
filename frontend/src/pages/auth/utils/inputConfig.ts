export const inputConfig = [
  {
    id: 1,
    name: "username",
    type: "text",
    placeholder: "username",
    errorMessage: "Please enter a valid username between 3 and 13 digit",
    label: "Username",
    maxLength: 13,
    pattern: "^[a-zA-Z]([_](?![_])|[a-zA-Z0-9]){1,13}[a-zA-Z0-9]$",
    required: true,
  },
  {
    id: 2,
    name: "password",
    type: "password",
    placeholder: "Password",
    errorMessage:
      "Password should be 8-20 characters and include at least 1 capital letter, 1 number and 1 special character!",
    label: "Password",
    pattern: `^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{3,20}$`,
    required: true,
  },
];
