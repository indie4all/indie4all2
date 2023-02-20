export default function (...args: any[]) {
	// Remove options object
	return args.slice(0, -1).join('');
}