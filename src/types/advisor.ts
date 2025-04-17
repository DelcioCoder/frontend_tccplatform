export interface Advisor {
    user_id: number;
    username: string;
    specialization: string;
    coverImage?: string;
    biography: string;
    birthImage?: string;
    profilePicture?: string;
    isVerified?: boolean;
    clientsCount?: number;
    experienceYears?: number;
    expertiseAreas?: string[];
}

export interface Student {
    user_id: number;
    username: string;
    course: string;
    graduation_year: number;
    tcc_interest: string;
}