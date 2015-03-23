/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 * @requiresPackage Weber.Translation
 * @requiresPackage Weber.Tracking
 */
anyLib.registerNamespace("Weber.Application");

Weber.Application.DefaultModule = Class.create(anyLib.Application.Module, {
	_name: "default",
	_namespace: Weber.Application
});
