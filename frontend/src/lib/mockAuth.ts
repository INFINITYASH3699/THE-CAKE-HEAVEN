import { User, LoginCredentials, RegisterData } from "@/types";

// Sample users for mock authentication
const mockUsers: (User & { password: string })[] = [
  {
    _id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    isActive: true,
    createdAt: "2023-01-15T10:30:00.000Z",
    lastLogin: new Date().toISOString(),
    wallet: {
      balance: 100,
      history: [
        {
          amount: 100,
          description: "Signup bonus",
          date: "2023-01-15T10:30:00.000Z",
        },
      ],
    },
    addresses: [],
  },
  {
    _id: "2",
    name: "Regular User",
    email: "user@example.com",
    password: "user123",
    role: "user",
    isActive: true,
    createdAt: "2023-02-20T15:45:00.000Z",
    lastLogin: new Date().toISOString(),
    wallet: {
      balance: 200,
      history: [
        {
          amount: 100,
          description: "Signup bonus",
          date: "2023-02-20T15:45:00.000Z",
        },
        {
          amount: 100,
          description: "Referral bonus",
          date: "2023-03-01T10:30:00.000Z",
        },
      ],
    },
    addresses: [
      {
        _id: "101",
        fullName: "Regular User",
        mobileNumber: "1234567890",
        address: "123 Main St",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "USA",
        isDefault: true,
      },
    ],
  },
];

// Simulate delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock login function
export const mockLogin = async ({ email, password }: LoginCredentials) => {
  // Add delay to simulate network request
  await delay(1000);

  // Find user by email
  const user = mockUsers.find((u) => u.email === email);

  // Check if user exists and password matches
  if (!user) {
    throw new Error("User not found");
  }

  if (user.password !== password) {
    throw new Error("Invalid password");
  }

  // Create a fake JWT token
  const fakeToken = `mock_token_${user._id}_${Date.now()}`;

  // Create a clone of the user without the password
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user;

  // Return user data and token like a real API would
  return {
    token: fakeToken,
    user: userWithoutPassword,
  };
};

// Mock get profile function
export const mockGetProfile = async (): Promise<User> => {
  await delay(500);

  // In a real app, this would verify the token and return the user profile
  // For this mock, we'll just return the admin user
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = mockUsers[0];
  return userWithoutPassword;
};

// Mock register function
export const mockRegister = async ({ name, email, password }: RegisterData) => {
  await delay(1000);

  // Check if user email already exists
  if (mockUsers.some((u) => u.email === email)) {
    throw new Error("Email already registered");
  }

  // Create new mock user
  const newUser = {
    _id: `mock_${Date.now()}`,
    name,
    email,
    password,
    role: "user",
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    wallet: {
      balance: 100,
      history: [
        {
          amount: 100,
          description: "Signup bonus",
          date: new Date().toISOString(),
        },
      ],
    },
    addresses: [] as Array<{
      _id: string;
      fullName: string;
      mobileNumber: string;
      address: string;
      city: string;
      state: string;
      zip: string;
      country: string;
      isDefault: boolean;
    }>,
  };

  // In a real app, would save to DB
  mockUsers.push(newUser);

  // Return token and user without password
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = newUser;
  return {
    token: `mock_token_${newUser._id}_${Date.now()}`,
    user: userWithoutPassword,
  };
};
