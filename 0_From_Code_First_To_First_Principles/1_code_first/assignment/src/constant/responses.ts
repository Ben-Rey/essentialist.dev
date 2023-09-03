// { error: "ValidationError", data: undefined, success: false }
export const validationError = {
  status: 400,
  data: {
    error: "ValidationError",
    data: undefined,
    success: false,
  },
};

export const internalError = {
  status: 500,
  data: {
    error: "InternalError",
    data: undefined,
    success: false,
  },
};

export const emailAlreadyInUse = {
  status: 409,
  data: {
    error: "EmailAlreadyInUse",
    data: undefined,
    success: false,
  },
};

export const userNameTaken = {
  status: 409,
  data: {
    error: "UsernameAlreadyTaken",
    data: undefined,
    success: false,
  },
};

export const userNotFound = {
  status: 404,
  data: { error: "UserNotFound", data: undefined, success: false },
};

export const success = {
  data: (data: any) => ({
    error: undefined,
    data,
    success: true,
  }),
};
