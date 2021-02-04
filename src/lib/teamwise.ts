export const getReadwiseHighlights = async () => {
	return fetch("https://readwise.io/api/v2/highlights?page_size=10", {
		method: "GET",
		headers: {
			Authorization: "Token s"
		}
	})
		.then(r => r.json())
		.then(r => {
			console.log(r);
			return r;
		});
};
