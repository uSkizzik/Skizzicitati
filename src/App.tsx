import React, { useEffect, useState } from "react"
import { Form, Offcanvas, OverlayTrigger, Popover } from "react-bootstrap"

import classNames from "classnames"

import { IAuthor, IQuote, IQuoteAuthor } from "@/interfaces/Quote.interface"

import authors from "./data/authors.json"
import quotes from "./data/quotes.json"

function getAuthorQuotes(authorId: number) {
	return quotes.filter((q) => q.authors.some((a) => a.authorId === authorId))
}

function AuthorFilter({ author, isSelected, addSelectedAuthor, removeSelectedAuthor }: { author: IAuthor; isSelected: boolean; addSelectedAuthor: (authorId: number) => void; removeSelectedAuthor: (authorId: number) => void }) {
	const authorQuotes = getAuthorQuotes(author.authorId)

	return (
		<div className={classNames("tw-flex tw-items-center tw-p-1 tw-mt-1 tw-rounded tw-cursor-pointer hover:tw-bg-[rgba(256,256,256,0.05)]", { "tw-bg-[rgba(256,256,256,0.05)]": isSelected })} onClick={() => (!isSelected ? addSelectedAuthor(author.authorId) : removeSelectedAuthor(author.authorId))}>
			<img className="tw-w-[50px] tw-h-[50px] tw-rounded-full tw-me-2" alt="" width={50} height={50} src={"/avatars/" + author.authorId + ".webp"} onError={(e) => ((e.target as HTMLImageElement).src = "/avatars/default/" + (author.authorId % 5) + ".png")} />
			<div>
				<h1 className="tw-block tw-font-bold">{author.name}</h1>
				<span>Цитати: {authorQuotes.length}</span>
			</div>
		</div>
	)
}

function AuthorPopover({ quoteAuthor }: { quoteAuthor: IQuoteAuthor }) {
	let author = authors.find((a) => a.authorId === quoteAuthor.authorId) as IAuthor
	if (!author) author = { authorId: Number.MAX_VALUE, name: "Непознат Автор" }

	const authorQuotes = getAuthorQuotes(author.authorId)
	const aliases = Array.from(
		new Set(
			authorQuotes
				.map((q) => {
					return (q.authors.find((a) => a.authorId === author.authorId) as IQuoteAuthor).creditedAs
				})
				.map((a) => {
					return a
						.trim()
						.split(/ v(uv)? /)[0]
						.split(/ s(us)? /)[0]
						.split(/ [a-z]+ki /)[0]
						.split(/ [a-z]+sht /)[0]
						.split(/ [a-z]+ing /)[0]
						.split(" kum")[0]
						.split(" dokato ")[0]
						.split(" kogato ")[0]
						.split(" sled ")[0]
						.split(" izvun ")[0]
						.split(" za ")[0]
						.split(" out of context ")[0]
						.split(",")[0]
						.trim()
				})
				.map((a) => {
					const b = a.slice(0, 4).normalize()
					return b[0].toUpperCase() + b.slice(1) + a.slice(4)
				})
				.filter((a) => {
					return a.toLowerCase() !== author.name.toLowerCase().trim()
				})
				.sort()
		)
	)

	return (
		<Popover className="tw-p-4 tw-w-[300px] tw-rounded tw-bg-background-300">
			<div className="tw-flex tw-items-center">
				<img className="tw-w-[50px] tw-h-[50px] tw-rounded-full tw-me-2" alt="" width={50} height={50} src={"/avatars/" + author.authorId + ".webp"} onError={(e) => ((e.target as HTMLImageElement).src = "/avatars/default/" + (author.authorId % 5) + ".png")} />
				<div>
					<h1 className="tw-block tw-font-bold">{author.name}</h1>
					<span>Цитати: {authorQuotes.length}</span>
				</div>
			</div>
			{aliases.length ? (
				<>
					<div className="tw-mt-3 tw-font-bold">Познат също като:</div>
					<div className="tw-text-sm tw-overflow-auto tw-pb-1">
						{aliases.map((a) => (
							<span className="tw-block tw-text-nowrap">{a}</span>
						))}
					</div>
				</>
			) : null}
		</Popover>
	)
}

function Quote({ quote }: { quote: IQuote }) {
	if (quote.content.length > 1) return <Dialogue quote={quote} />

	const Popover = (
		<div>
			<AuthorPopover quoteAuthor={quote.authors[0]} />
		</div>
	)

	return (
		<div
			className={classNames("sm:tw-px-6 tw-py-3 tw-w-full tw-flex tw-rounded", {
				// "tw-bg-[rgba(153,101,21)]": quote.starred
			})}
		>
			<OverlayTrigger trigger="click" placement="right" offset={[15, 10]} overlay={Popover}>
				<div className="tw-relative tw-max-h-[50px]">
					<img className="tw-min-w-[50px] tw-min-h-[50px] tw-rounded-full tw-me-3 tw-cursor-pointer" alt="" width={50} height={50} src={"/avatars/" + quote.authors[0].authorId + ".webp"} onError={(e) => ((e.target as HTMLImageElement).src = "/avatars/default/" + (quote.authors[0].authorId % 5) + ".png")} />
					{quote.starred ? <i className="fas fa-star tw-text-[gold] tw-text-md tw-absolute tw-bottom-0 tw-right-2" /> : <i />}
				</div>
			</OverlayTrigger>

			<div>
				<div>
					<OverlayTrigger trigger="click" placement="right" offset={[30, 10]} overlay={Popover}>
						<span className="tw-font-bold tw-cursor-pointer hover:tw-underline">{quote.authors[0].creditedAs}</span>
					</OverlayTrigger>
				</div>
				<span className="tw-whitespace-pre-line">{quote.content}</span>
			</div>
		</div>
	)
}

function Dialogue({ quote }: { quote: IQuote }) {
	return (
		<div className="sm:tw-px-6 tw-py-3 tw-w-full tw-flex tw-rounded">
			<div className="tw-relative tw-me-3 tw-min-w-[50px] tw-min-h-[50px] tw-max-h-[50px]">
				<img className="tw-min-w-[35px] tw-min-h-[35px] tw-rounded-full tw-outline tw-outline-background-600 tw-absolute tw-z-10" alt="" width={35} height={35} src={"/avatars/" + quote.authors[0].authorId + ".webp"} onError={(e) => ((e.target as HTMLImageElement).src = "/avatars/default/" + (quote.authors[0].authorId % 5) + ".png")} />
				<img className="tw-min-w-[35px] tw-min-h-[35px] tw-rounded-full tw-absolute tw-bottom-0 tw-right-0" alt="" width={35} height={35} src={"/avatars/" + quote.authors[1].authorId + ".webp"} onError={(e) => ((e.target as HTMLImageElement).src = "/avatars/default/" + (quote.authors[1].authorId % 5) + ".png")} />
				{quote.starred ? <i className="fas fa-star tw-text-[gold] tw-text-md tw-absolute -tw-bottom-1 -tw-right-2" /> : <i />}
			</div>

			<div className="tw-flex tw-flex-col">
				{quote.content.map((c, i) => (
					<div key={i} className="tw-flex">
						<div>
							<OverlayTrigger
								trigger="click"
								placement="right"
								offset={[30, 10]}
								overlay={
									<div>
										<AuthorPopover quoteAuthor={quote.authors[i]} />
									</div>
								}
							>
								<span className="tw-font-bold tw-me-1 tw-cursor-pointer hover:tw-underline">{quote.authors[i].creditedAs}:</span>
							</OverlayTrigger>
						</div>
						<span className="tw-whitespace-pre-line">{c}</span>
					</div>
				))}
			</div>
		</div>
	)
}

function Container({ className, children }: { className?: string; children: React.ReactNode }) {
	return <div className={classNames("tw-px-3 tw-py-6 tw-rounded tw-shadow tw-bg-background-600 tw-container", className)}>{children}</div>
}

function App() {
	const [show, setShow] = useState(false)

	const [selectedAuthors, setSelectedAuthors] = useState<number[]>([])

	const [showSingularQuotes, setShowSingularQuotes] = useState(true)
	const [showDialogues, setShowDialogues] = useState(true)
	const [onlyStarred, setOnlyStarred] = useState(false)

	const [latestNewQuotes, setLatestNewQuotes] = useState(0)

	const addSelectedAuthor = (authorId: number) => {
		setSelectedAuthors(Array.from(new Set([...selectedAuthors, authorId])))
	}

	const removeSelectedAuthor = (authorId: number) => {
		const authorIndex = selectedAuthors.findIndex((a) => a === authorId)
		if (authorIndex === -1) return

		setSelectedAuthors(selectedAuthors.toSpliced(authorIndex, 1))
	}

	useEffect(() => {
		setLatestNewQuotes(quotes.findLastIndex((q) => q.newQuotes))
	}, [quotes])

	return (
		<>
			<button className="tw-text-gray-400 tw-text-xl tw-fixed tw-top-4 tw-right-4 hover:tw-text-gray-100" onClick={() => setShow(true)}>
				<i className="fas fa-filter" />
			</button>

			<a className="tw-flex tw-items-center tw-justify-center tw-text-gray-400 tw-text-xl tw-rounded-full tw-bg-background-600 tw-w-[45px] tw-h-[45px] tw-fixed tw-bottom-6 tw-right-6 hover:tw-text-gray-100" href="#new">
				<i className="fas fa-chevron-down" />
			</a>

			<Offcanvas className="tw-bg-background-500" show={show} placement="end" backdrop={false} scroll onHide={() => setShow(false)}>
				<Offcanvas.Header closeButton>
					<Offcanvas.Title>Филтриране</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body>
					<div className="tw-mb-6">
						<h3 className="tw-font-bold tw-mb-2">По тип:</h3>
						<Form.Check label="Единичен Цитат" checked={showSingularQuotes} onChange={(e) => setShowSingularQuotes(Boolean(e.target.checked))} />
						<Form.Check label="Диалогов Цитат" checked={showDialogues} onChange={(e) => setShowDialogues(Boolean(e.target.checked))} />
						<Form.Switch className="tw-mt-2" label="Със Звездичка" checked={onlyStarred} onChange={(e) => setOnlyStarred(Boolean(e.target.checked))} />
					</div>
					<div>
						<h3 className="tw-font-bold tw-mb-2">По автор:</h3>
						{authors
							.sort((a, b) => a.name.localeCompare(b.name))
							.sort((a, b) => getAuthorQuotes(b.authorId).length - getAuthorQuotes(a.authorId).length)
							.map((a) => (
								<AuthorFilter author={a} isSelected={selectedAuthors.includes(a.authorId)} addSelectedAuthor={addSelectedAuthor} removeSelectedAuthor={removeSelectedAuthor} />
							))}
					</div>
				</Offcanvas.Body>
			</Offcanvas>

			<div className="tw-py-10 tw-flex tw-flex-col tw-items-center">
				<Container className="tw-mb-3">
					<div className="tw-px-2 sm:tw-px-6">
						<h1
							className="tw-inline-block tw-text-5xl tw-font-extrabold"
							style={{
								background: "linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)",
								WebkitTextFillColor: "transparent",
								backgroundClip: "text"
							}}
						>
							Skizzicitati
						</h1>
						<div className="tw-text-lg tw-mt-2 tw-text-gray-200">
							<p className="tw-mb-3">Skizzicitati е колекция от забавни цитати и изцепки, които съм чул (или казал) и записал.</p>
							<p className="tw-mb-3">
								Колекцията расте постоянно от 2021 г. насам, като вмомента съдържа <strong>{quotes.length}</strong> цитата. Беше крайно време да се направи една добре изглеждаща страница, до която всеки има достъп, за да провери колко голям идиот е.
							</p>
							{/*<p className="tw-mb-3">*/}
							{/*	Тук могат да се намерят два вида цитати - единични и диалогови. Диалоговите, както името подсказва, включват двама или повече човека. Цитати, които имат звездичка (<i className="fas fa-star" />) до снимката на автора са (според моя преценка) най-забавни и най-запомнящи се.*/}
							{/*</p>*/}
							{/*<p className="tw-mb-3">За ваше удобство, можете да натиснете върху името или профилната снимка на някой, за да видите колко цитати има определения човек и с какви други имена са записвани. Също така можете да филтрирате цитатите като използвате менюто, което можете да отворите с бутончето горе в дясно.</p>*/}
						</div>
					</div>
				</Container>
				<Container>
					{quotes
						.filter((q) => ((showSingularQuotes || showDialogues) && !showSingularQuotes ? q.content.length > 1 : true))
						.filter((q) => ((showSingularQuotes || showDialogues) && !showDialogues ? q.content.length === 1 : true))
						.filter((q) => (onlyStarred ? q.starred : true))
						.filter((q) => (selectedAuthors.length ? q.authors.some((a) => selectedAuthors.includes(a.authorId)) : true))
						.map((q, i) => {
							const content: React.ReactNode[] = []

							if (latestNewQuotes === i && showSingularQuotes && showDialogues && !onlyStarred && selectedAuthors.length === 0) {
								content.push(
									<div id="new" className="tw-px-6 tw-my-2 tw-w-full tw-flex tw-items-center">
										<span key={i + "-2"} className="tw-relative tw-text-xs tw-font-bold tw-px-1 tw-rounded-md tw-bg-[red] after:tw-absolute after:tw-w-0 after:tw-h-0 after:tw-top-0 -after:tw-right-2 after:tw-border-8 after:tw-border-[transparent_transparent_transparent_red]">
											НОВИ
										</span>
										<hr className="tw-flex-grow tw-opacity-100 tw-text-[red] tw-rounded tw-border-[red]" />
									</div>
								)
							}

							content.push(<Quote key={i} quote={q} />)

							return content
						})}
				</Container>
			</div>
		</>
	)
}

export default App
