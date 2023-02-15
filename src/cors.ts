export function isAllowedOrigin(requestOrigin: string | undefined): boolean {
	// Allow mobile requests / curl (i.e. trusted user agents don't use CORS)
	if (!requestOrigin) {
		return true;
	}

	// Specific ports for FE
	const allowedLocalPorts = [3000];

	// Specific deployed application url (Netlify)
	const allowedProductionUrl = "https://taupe-daifuku-ff591d.netlify.app";

	const allowed: (string | RegExp)[] = [
		...allowedLocalPorts.map((localPort) => `http://localhost:${localPort}`),
		allowedProductionUrl,
	];

	return allowed.some((allowedOrigin) => {
		if (allowedOrigin instanceof RegExp) {
			return allowedOrigin.test(requestOrigin);
		} else {
			return allowedOrigin === requestOrigin;
		}
	});
}
