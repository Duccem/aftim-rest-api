import { RequestTokenized } from '../Auth/IResquest';

export class Paginator {
	private request: RequestTokenized;
	private total: number;
	private count: number;
	private data: any;
	constructor(request: RequestTokenized, data: any) {
		this.request = request;
		this.total = data.count;
		this.count = data.data.length;
		this.data = data.data;
		this.makeUrls();
	}

	public get payload(): any {
		return {
			data: this.data,
			paginator: this.getPages(),
		};
	}

	public getPages(): any {
		return {
			links: this.makeUrls(),
			counters: this.makeCounters(),
		};
	}

	private makeCounters() {
		return {
			records: this.count,
			totalRecords: this.total,
			page: parseInt(<string>this.request.query.page || '1'),
			pageSize: parseInt(<string>this.request.query.limit || '50'),
			totalPages: Math.round(this.total / parseInt(<string>this.request.query.limit || '50')),
		};
	}

	private makeUrls() {
		let currentUrl = `${process.env.BASE_URL}${this.request.originalUrl}`;
		let firstUrl = `${process.env.BASE_URL}${this.request.path}`;
		let lastUrl = `${process.env.BASE_URL}${this.request.originalUrl}`;
		let prevUrl = 'Your in the first page';
		let nextUrl = 'Your in the last page';
		let page = <string>this.request.query.page || '1';
		let size = <string>this.request.query.limit || '50';
		let lastPage = Math.round(this.total / parseInt(size));

		lastUrl = lastUrl.replace(/page=[1,2,3,4,5,6,7,8,9]/g, `page=${lastPage == 0 ? 1 : lastPage}`);
		if (this.total > parseInt(page) * parseInt(size)) {
			nextUrl = nextUrl = `${process.env.BASE_URL}${this.request.originalUrl}`;
			nextUrl = nextUrl.replace(/page=[1,2,3,4,5,6,7,8,9]/g, `page=${parseInt(page || '0') + 1}`);
		}

		if (parseInt(page) > 1) {
			prevUrl = `${process.env.BASE_URL}${this.request.originalUrl}`;
			prevUrl = prevUrl.replace(/page=[1,2,3,4,5,6,7,8,9]/g, `page=${parseInt(page || '0') - 1}`);
		}

		return {
			currentUrl,
			firstUrl,
			lastUrl,
			prevUrl,
			nextUrl,
		};
	}
}
