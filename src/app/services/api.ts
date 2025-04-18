import { v4 as uuidv4 } from "uuid";
import {
  LoginCredentials,
  RegisterCredentials,
  AdFormData,
  User,
  Ad,
} from "../types";

// Mock data for simulating a database
const MOCK_USERS_KEY = "mock_users";
const MOCK_ADS_KEY = "mock_ads";

// Load mock data from localStorage if available
const loadMockUsers = (): User[] => {
  if (typeof window === "undefined") return [];
  const storedUsers = localStorage.getItem(MOCK_USERS_KEY);
  return storedUsers ? JSON.parse(storedUsers) : [];
};

const loadMockAds = (): Ad[] => {
  if (typeof window === "undefined") return [];
  const storedAds = localStorage.getItem(MOCK_ADS_KEY);
  return storedAds ? JSON.parse(storedAds) : [];
};

// Save mock data to localStorage
const saveMockUsers = (users: User[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  }
};

const saveMockAds = (ads: Ad[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(MOCK_ADS_KEY, JSON.stringify(ads));
  }
};

// Initialize with some data if empty
const initializeMockData = () => {
  const users = loadMockUsers();
  const ads = loadMockAds();

  if (users.length === 0) {
    const defaultUser: User = {
      id: uuidv4(),
      email: "test@example.com",
      token: "mock-token-123",
      refreshToken: "mock-refresh-token-123",
    };
    saveMockUsers([defaultUser]);
  }

  if (ads.length === 0) {
    // Create some sample ads
    const sampleAds: Ad[] = [
      {
        id: uuidv4(),
        title: "iPhone 12 Pro",
        description:
          "Like new iPhone 12 Pro, 128GB Storage, Pacific Blue, includes original box and accessories.",
        category: "Electronics",
        province: "Istanbul",
        district: "Kadikoy",
        price: 12000,
        images: [
          "https://images.unsplash.com/photo-1603891128711-11b4b03bb138",
          "https://images.unsplash.com/photo-1592286927505-1def25115929",
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: users[0]?.id || uuidv4(),
      },
      {
        id: uuidv4(),
        title: "Modern Apartment for Rent",
        description:
          "Beautiful 2+1 apartment in the heart of the city. Newly renovated with modern appliances.",
        category: "Real Estate",
        province: "Ankara",
        district: "Cankaya",
        price: 4500,
        images: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
          "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: users[0]?.id || uuidv4(),
      },
      {
        id: uuidv4(),
        title: "Toyota Corolla 2019",
        description:
          "Toyota Corolla 2019 model, automatic transmission, 45000 km, single owner.",
        category: "Vehicles",
        province: "Izmir",
        district: "Konak",
        price: 350000,
        images: [
          "https://images.unsplash.com/photo-1590362891991-f776e747a588",
          "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd",
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: users[0]?.id || uuidv4(),
      },
    ];

    saveMockAds(sampleAds);
  }
};

// Initialize mock data
initializeMockData();

// Simulated delay to mimic API call
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Auth API
const auth = {
  login: async (credentials: LoginCredentials) => {
    await delay(1000); // Simulate network delay

    const users = loadMockUsers();
    const user = users.find((u) => u.email === credentials.email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // In a real app, we would verify the password here
    // For this mock, we'll just return the user

    return { data: user };
  },

  register: async (userData: RegisterCredentials) => {
    await delay(1000);

    const users = loadMockUsers();

    // Check if email already exists
    if (users.find((u) => u.email === userData.email)) {
      throw new Error("Email already in use");
    }

    // Create new user
    const newUser: User = {
      id: uuidv4(),
      email: userData.email,
      token: `token-${Math.random().toString(36).substring(2, 15)}`,
      refreshToken: `refresh-${Math.random().toString(36).substring(2, 15)}`,
    };

    // Add to mock database
    users.push(newUser);
    saveMockUsers(users);

    return { data: { success: true } };
  },

  refreshToken: async (refreshToken: string) => {
    await delay(500);

    const users = loadMockUsers();
    const user = users.find((u) => u.refreshToken === refreshToken);

    if (!user) {
      throw new Error("Invalid refresh token");
    }

    // Generate new tokens
    const updatedUser = {
      ...user,
      token: `token-${Math.random().toString(36).substring(2, 15)}`,
      refreshToken: `refresh-${Math.random().toString(36).substring(2, 15)}`,
    };

    // Update in mock database
    saveMockUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));

    return { data: updatedUser };
  },
};

// Ads API
const ads = {
  getAll: async () => {
    await delay(800);
    const mockAds = loadMockAds();
    return { data: mockAds };
  },

  getById: async (id: string) => {
    await delay(500);
    const mockAds = loadMockAds();
    const ad = mockAds.find((a) => a.id === id);

    if (!ad) {
      throw new Error("Advertisement not found");
    }

    return { data: ad };
  },

  create: async (adData: AdFormData) => {
    await delay(1200);

    // Get current user from localStorage (would be from auth system in real app)
    const token = localStorage.getItem("token");
    const users = loadMockUsers();
    const user = users.find((u) => u.token === token);

    if (!user) {
      throw new Error("Not authenticated");
    }

    // Create new ad
    const newAd: Ad = {
      id: uuidv4(),
      title: adData.title,
      description: adData.description,
      category: adData.category,
      province: adData.province,
      district: adData.district,
      price: adData.price,
      // In a real app, we would upload the images and get URLs back
      // For this mock, we'll use placeholder images
      images:
        adData.images.length > 0
          ? [
            "https://via.placeholder.com/800x600",
            "https://via.placeholder.com/800x600",
          ]
          : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user.id,
    };

    // Add to mock database
    const mockAds = loadMockAds();
    mockAds.push(newAd);
    saveMockAds(mockAds);

    return { data: newAd };
  },

  update: async (id: string, adData: AdFormData) => {
    await delay(1000);

    // Get current user from localStorage (would be from auth system in real app)
    const token = localStorage.getItem("token");
    const users = loadMockUsers();
    const user = users.find((u) => u.token === token);

    if (!user) {
      throw new Error("Not authenticated");
    }

    // Find the ad to update
    const mockAds = loadMockAds();
    const adIndex = mockAds.findIndex((a) => a.id === id);

    if (adIndex === -1) {
      throw new Error("Advertisement not found");
    }

    // Check ownership
    if (mockAds[adIndex].userId !== user.id) {
      throw new Error("Not authorized to update this advertisement");
    }

    // Update the ad
    const updatedAd: Ad = {
      ...mockAds[adIndex],
      title: adData.title,
      description: adData.description,
      category: adData.category,
      province: adData.province,
      district: adData.district,
      price: adData.price,
      // Keep existing images in a real app, we would handle updating images separately
      updatedAt: new Date().toISOString(),
    };

    mockAds[adIndex] = updatedAd;
    saveMockAds(mockAds);

    return { data: updatedAd };
  },

  delete: async (id: string) => {
    await delay(800);

    // Get current user from localStorage (would be from auth system in real app)
    const token = localStorage.getItem("token");
    const users = loadMockUsers();
    const user = users.find((u) => u.token === token);

    if (!user) {
      throw new Error("Not authenticated");
    }

    // Find the ad to delete
    const mockAds = loadMockAds();
    const adIndex = mockAds.findIndex((a) => a.id === id);

    if (adIndex === -1) {
      throw new Error("Advertisement not found");
    }

    // Check ownership
    if (mockAds[adIndex].userId !== user.id) {
      throw new Error("Not authorized to delete this advertisement");
    }

    // Delete the ad
    mockAds.splice(adIndex, 1);
    saveMockAds(mockAds);

    return { data: { success: true } };
  },
};

export default {
  auth,
  ads,
};
