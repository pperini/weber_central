/**
 * @package Weber.Translation
 * @requiresPackage anyLib
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber");

function t(key) {
	if (typeof(availableTranslations[key]) == "undefined")
		return key;

	return availableTranslations[key];
}
