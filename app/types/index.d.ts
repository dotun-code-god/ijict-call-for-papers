type UploadedFile = {
    src: string;
    size: number;
    provider: string;
}

type SubmissionPaperType = {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    university_organization_affiliation: string;
    department: string;
    full_paper_title: string;
    authors: string;
    abstract: string;
    keywords: string;
    additional_information: string;
    paper: File | null;
}