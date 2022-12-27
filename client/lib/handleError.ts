
export const handleError = (err: any) => {
    if (process.env.NODE_ENV === 'development') console.error(err);
};
