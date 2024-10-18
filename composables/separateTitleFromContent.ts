/**
 * Returns separated title and content strings from the CMS provided copy.
 *
 * @param {string} copy text provided by the CMS that has the title and content
 * combined into one string.
 * E.g. '<vs-heading level=\"3\" id=\"lorem-ipsum-dolor-sit-amet\">Lorem ipsum dolor sit amet</vs-heading>\n\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>' 
 * @return {object} { title, content } to be used within a component.
 */
export default (copy: string) => {
    const headingClosingTag = '</vs-heading>';

    // Get position of first heading closing tag.
    const indexOfClosingTag = copy.indexOf(headingClosingTag);

    // Extract the title from the copy and remove heading tags.
    const title = copy
        .substring(0, indexOfClosingTag + headingClosingTag.length)
        .replace(headingClosingTag, '')
        .replace(/<vs-heading.*>/, '');
    
    // Extract the content from the copy and remove line breaks at the beginning.
    const content = copy
        .substring(indexOfClosingTag + headingClosingTag.length)
        .replace(/\n\n</, '<');

    return { title, content };
};
