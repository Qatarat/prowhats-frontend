export interface LoginResponse {
  id: number;
  userName: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  popupShowingDate: string | null;
  can_podcast: number;
  clientOrders: any[]; // Replace `any` with a type if clientOrders has a defined structure
}
export interface UpdatePhonnePayload {
  phoneNumber: number;
  newPhoneNumber: number;
  otp: number;
}

export interface UserResponse {
  id: number;
  userName: string;
  email: string;
  role: string;
  profilePicture?: string; // optional if not always present
  phoneNumber: string;
  popupShowingDate: string | null;
  can_podcast: number;
  clientOrders: ClientOrder[];
}
export interface GeustResponse {
  id: number;
  userName: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  popupShowingDate: string;
  clientOrders: null | ClientOrder[];
}

export interface ClientOrder {
  orderId: number;
  status: "pending" | "completed" | "cancelled";
  amount: number;
}

export interface SendOtpPayload {
  phoneNumber: string;
  sendNew?: boolean;
}
export interface LoginPayload {
  phoneNumber: string;
  token: string;
}
export interface SettingsCode {
  currency_code: string;
  lang_code: string;
  country_code: string;
}
export interface UpdateProfile {
  name: string;
  email: string;
}

export interface UserSettingsResposne {
  name: string;
  username: string;
  phone: string;
  lang_code: string;
  country: {
    id: number;
    name: string;
    arabic_name: string;
    capital: string;
    continent_code: string;
    continent_name: string;
    three_letter_country_code: string;
    phone_code: number;
    country_code: string;
  };
  currency: {
    id: number;
    name: string;
    code: string;
    symbol_native: string;
  };
}

export interface UserApiResponse {
  page_image: PageImage;
  user_profile: UserProfile;
  show_app_rating: boolean;
  popup_group: null | PopupGroup;
  deep_links: DeepLink[];
}

interface PageImage {
  id: number;
  type: string;
  country_id: number;
  country_name: string;
  is_active: boolean;
  image: string;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  imageId: number;
  imageUrl: string;
  ordersCount: number;
  totalSpending: number;
  language: number;
  languageName: string;
  street: string;
  city: string;
  state: string;
  countryName: string;
  countryArabicName: string;
  countryId: number;
  zipCode: string;
  phoneNumber: string;
  show_campaign_menu: boolean;
}

interface PopupGroup {
  // Define structure if known, otherwise keep as any or null
  [key: string]: any;
}

interface DeepLink {
  // Define structure if known, otherwise keep as any
  [key: string]: any;
}
