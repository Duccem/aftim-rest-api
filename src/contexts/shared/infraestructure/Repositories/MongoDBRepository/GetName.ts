import 'reflect-metadata';
export function getName() {
	return function (target: any, key: string, descriptor: PropertyDescriptor) {
		let tipo = Reflect.getMetadata('design:returntype', target, key);
		console.log(tipo);
		console.log(key);
		console.log(descriptor);
	};
}
