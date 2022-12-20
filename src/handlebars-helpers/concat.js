export default function (...args) {
	// Remove options object
	return args.slice(0, -1).join('');
}