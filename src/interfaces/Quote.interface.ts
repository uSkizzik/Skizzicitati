export interface IAuthor {
	authorId: number
	name: string
}

export interface IQuoteAuthor {
	authorId: number
	creditedAs: string
}

export interface IQuote {
	starred?: boolean
	newQuotes?: boolean
	date?: string
	content: string[]
	authors: IQuoteAuthor[]
}
