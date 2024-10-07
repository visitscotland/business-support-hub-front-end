
export default (copy: string) => {
    const value = copy.split('</vs-heading>');

    const title = value[0].replace(/<vs-heading.*>/, '');
    const content = value[1].replace(/\n\n</g, '<');

    return { title, content };
};
