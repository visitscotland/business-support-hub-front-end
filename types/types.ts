export type LooseObject = {
    [key: string]: any;
};

export type TableOfContentLink = {
    anchor: string;
    title: string;
};

export type DownloadCardLink = {
    extension: string;
    label: string;
    link: string;
    publishedDate: string;
    size: string;
    teaser: string;
};

export type EventsCategories = 'training' | 'industry' | 'travel';
export type EventsTabKey = Partial<Record<EventsCategories, Date>>;