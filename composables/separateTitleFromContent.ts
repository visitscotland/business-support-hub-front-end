/**
 * Returns separated title and content strings from the CMS provided copy.
 *
 * @param {string} copy text provided by the CMS that has the title and content
 * combined into one string.
 * E.g. '<vs-heading level=\"3\" id=\"lorem-ipsum-dolor-sit-amet\">Lorem ipsum dolor sit amet</vs-heading>\n\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>' 
 * @return {object} { title, content } to be used within a component.
 */
export default (copy: string) => {
    // Split the copy string to separate the title from the body content.
    const value = copy.split('</vs-heading>');

    // Remove "<vs-heading...>" tag from the beginning of the string
    // to get the title.
    const title = value[0].replace(/<vs-heading.*>/, '');

    // Replace line breaks at beginning of string.
    const content = value[1].replace(/\n\n</g, '<');

    return { title, content };
};
