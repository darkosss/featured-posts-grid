import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	InspectorControls,
	FontSizePicker,
	ColorPalette,
} from "@wordpress/block-editor";
import {
	Button,
	ComboboxControl,
	PanelBody,
	SelectControl,
	Spinner,
	ToggleControl,
	BaseControl,
	__experimentalBoxControl as BoxControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalUnitControl as UnitControl,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { useMemo, useState } from "@wordpress/element";
import { decodeEntities } from "@wordpress/html-entities";
import { chevronLeft, chevronRight } from "@wordpress/icons";

const MAX_POSTS = 6;
const DEFAULT_GAP = "1.5rem";

const stripHtml = (value = "") => value.replace(/<[^>]*>/g, "").trim();

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

const hasBoxValue = (value) => {
	if (!value || typeof value !== "object") {
		return false;
	}

	return Object.values(value).some(Boolean);
};

const getPostTitle = (post) => {
	return decodeEntities(
		stripHtml(post?.title?.rendered) ||
			__("Untitled post", "featured-posts-grid"),
	);
};

const getPostExcerpt = (post) => {
	const explicitExcerpt = stripHtml(post?.excerpt?.rendered);

	if (explicitExcerpt) {
		return decodeEntities(explicitExcerpt);
	}

	const contentFallback = stripHtml(post?.content?.rendered);

	if (!contentFallback) {
		return "";
	}

	return decodeEntities(
		contentFallback.split(/\s+/).slice(0, 24).join(" ") + "…",
	);
};

const getFeaturedImage = (post, imageSize) => {
	const featuredMedia = post?._embedded?.["wp:featuredmedia"]?.[0];

	if (!featuredMedia) {
		return null;
	}

	const sizedImage = featuredMedia?.media_details?.sizes?.[imageSize];

	return {
		url: sizedImage?.source_url || featuredMedia.source_url,
		alt: featuredMedia.alt_text || getPostTitle(post),
	};
};

const getWrapperStyle = (attributes) => {
	const {
		titleFontSize,
		titleFontWeight,
		titleLineHeight,
		titleLetterSpacing,
		titleTextTransform,
		excerptFontSize,
		excerptFontWeight,
		excerptLineHeight,
		excerptLetterSpacing,
		excerptTextTransform,
		rowGap,
		columnGap,
	} = attributes;

	return {
		"--dfpg-title-font-size": titleFontSize || undefined,
		"--dfpg-title-font-weight": titleFontWeight || undefined,
		"--dfpg-title-line-height": titleLineHeight || undefined,
		"--dfpg-title-letter-spacing": titleLetterSpacing || undefined,
		"--dfpg-title-text-transform": titleTextTransform || undefined,
		"--dfpg-excerpt-font-size": excerptFontSize || undefined,
		"--dfpg-excerpt-font-weight": excerptFontWeight || undefined,
		"--dfpg-excerpt-line-height": excerptLineHeight || undefined,
		"--dfpg-excerpt-letter-spacing": excerptLetterSpacing || undefined,
		"--dfpg-excerpt-text-transform": excerptTextTransform || undefined,
		"--dfpg-row-gap": rowGap || undefined,
		"--dfpg-column-gap": columnGap || undefined,
	};
};

const getCardStyle = (attributes) => {
	const { cardPadding = {}, cardBorder = {}, cardBorderRadius = {} } = attributes;
	const borderWidth = cardBorder.width || {};
	const style = {};

	if (cardPadding.top) {
		style.paddingTop = cardPadding.top;
	}

	if (cardPadding.right) {
		style.paddingRight = cardPadding.right;
	}

	if (cardPadding.bottom) {
		style.paddingBottom = cardPadding.bottom;
	}

	if (cardPadding.left) {
		style.paddingLeft = cardPadding.left;
	}

	if (cardBorder.color) {
		style.borderColor = cardBorder.color;
	}

	if (cardBorder.style) {
		style.borderStyle = cardBorder.style;
	}

	if (borderWidth.top) {
		style.borderTopWidth = borderWidth.top;
	}

	if (borderWidth.right) {
		style.borderRightWidth = borderWidth.right;
	}

	if (borderWidth.bottom) {
		style.borderBottomWidth = borderWidth.bottom;
	}

	if (borderWidth.left) {
		style.borderLeftWidth = borderWidth.left;
	}

	if (cardBorderRadius.value) {
		style.borderRadius = cardBorderRadius.value;
	}

	return style;
};

const TypographyPanel = ({
	title,
	fontSize,
	fontWeight,
	lineHeight,
	letterSpacing,
	textTransform,
	onChange,
}) => {
	return (
		<ToolsPanel
			label={title}
			resetAll={() => {
				onChange({
					fontSize: undefined,
					fontWeight: undefined,
					lineHeight: undefined,
					letterSpacing: undefined,
					textTransform: undefined,
				});
			}}
		>
			<ToolsPanelItem
				label={__("Font size", "featured-posts-grid")}
				hasValue={() => !!fontSize}
				onDeselect={() => onChange({ fontSize: undefined })}
			>
				<div className="dfpg-control-group">
					<FontSizePicker
						value={fontSize}
						onChange={(value) => onChange({ fontSize: value })}
						withSlider
					/>
				</div>
			</ToolsPanelItem>

			<ToolsPanelItem
				label={__("Font weight", "featured-posts-grid")}
				hasValue={() => !!fontWeight}
				onDeselect={() => onChange({ fontWeight: undefined })}
			>
				<div className="dfpg-control-group">
					<SelectControl
						label={__("Font weight", "featured-posts-grid")}
						value={fontWeight || ""}
						options={[
							{ label: __("Default", "featured-posts-grid"), value: "" },
							{ label: "300", value: "300" },
							{ label: "400", value: "400" },
							{ label: "500", value: "500" },
							{ label: "600", value: "600" },
							{ label: "700", value: "700" },
							{ label: "800", value: "800" },
						]}
						onChange={(value) => onChange({ fontWeight: value || undefined })}
					/>
				</div>
			</ToolsPanelItem>

			<ToolsPanelItem
				label={__("Line height", "featured-posts-grid")}
				hasValue={() => !!lineHeight}
				onDeselect={() => onChange({ lineHeight: undefined })}
			>
				<div className="dfpg-control-group">
					<UnitControl
						label={__("Line height", "featured-posts-grid")}
						value={lineHeight || ""}
						onChange={(value) => onChange({ lineHeight: value || undefined })}
					/>
				</div>
			</ToolsPanelItem>

			<ToolsPanelItem
				label={__("Letter spacing", "featured-posts-grid")}
				hasValue={() => !!letterSpacing}
				onDeselect={() => onChange({ letterSpacing: undefined })}
			>
				<div className="dfpg-control-group">
					<UnitControl
						label={__("Letter spacing", "featured-posts-grid")}
						value={letterSpacing || ""}
						onChange={(value) =>
							onChange({ letterSpacing: value || undefined })
						}
					/>
				</div>
			</ToolsPanelItem>

			<ToolsPanelItem
				label={__("Letter case", "featured-posts-grid")}
				hasValue={() => !!textTransform}
				onDeselect={() => onChange({ textTransform: undefined })}
			>
				<div className="dfpg-control-group">
					<SelectControl
						label={__("Letter case", "featured-posts-grid")}
						value={textTransform || ""}
						options={[
							{ label: __("Default", "featured-posts-grid"), value: "" },
							{
								label: __("Uppercase", "featured-posts-grid"),
								value: "uppercase",
							},
							{
								label: __("Lowercase", "featured-posts-grid"),
								value: "lowercase",
							},
							{
								label: __("Capitalize", "featured-posts-grid"),
								value: "capitalize",
							},
						]}
						onChange={(value) =>
							onChange({ textTransform: value || undefined })
						}
					/>
				</div>
			</ToolsPanelItem>
		</ToolsPanel>
	);
};

const DimensionsPanel = ({ cardPadding, columnGap, rowGap, setAttributes }) => {
	return (
		<ToolsPanel
			label={__("Dimensions", "featured-posts-grid")}
			resetAll={() =>
				setAttributes({
					cardPadding: {},
					columnGap: DEFAULT_GAP,
					rowGap: DEFAULT_GAP,
				})
			}
		>
			<ToolsPanelItem
				label={__("Padding", "featured-posts-grid")}
				hasValue={() => hasBoxValue(cardPadding)}
				onDeselect={() => setAttributes({ cardPadding: {} })}
			>
				<div className="dfpg-control-group">
					<BoxControl
						label={__("Padding", "featured-posts-grid")}
						values={cardPadding || {}}
						onChange={(value) => setAttributes({ cardPadding: value || {} })}
					/>
				</div>
			</ToolsPanelItem>

			<ToolsPanelItem
				label={__("Column gap", "featured-posts-grid")}
				hasValue={() => !!columnGap && columnGap !== DEFAULT_GAP}
				onDeselect={() => setAttributes({ columnGap: DEFAULT_GAP })}
			>
				<div className="dfpg-control-group">
					<UnitControl
						label={__("Column gap", "featured-posts-grid")}
						value={columnGap}
						onChange={(value) =>
							setAttributes({ columnGap: value || DEFAULT_GAP })
						}
					/>
				</div>
			</ToolsPanelItem>

			<ToolsPanelItem
				label={__("Row gap", "featured-posts-grid")}
				hasValue={() => !!rowGap && rowGap !== DEFAULT_GAP}
				onDeselect={() => setAttributes({ rowGap: DEFAULT_GAP })}
			>
				<div className="dfpg-control-group">
					<UnitControl
						label={__("Row gap", "featured-posts-grid")}
						value={rowGap}
						onChange={(value) =>
							setAttributes({ rowGap: value || DEFAULT_GAP })
						}
					/>
				</div>
			</ToolsPanelItem>
		</ToolsPanel>
	);
};

const BorderPanel = ({ cardBorder, cardBorderRadius, setAttributes }) => {
	const border = cardBorder || {};
	const borderWidth = border.width || {};

	return (
		<ToolsPanel
			label={__("Border", "featured-posts-grid")}
			resetAll={() =>
				setAttributes({
					cardBorder: {},
					cardBorderRadius: {},
				})
			}
		>
			<ToolsPanelItem
				label={__("Border", "featured-posts-grid")}
				hasValue={() =>
					!!border.color || !!border.style || hasBoxValue(borderWidth)
				}
				onDeselect={() => setAttributes({ cardBorder: {} })}
			>
				<div className="dfpg-control-group">
					<BaseControl
						label={__("Color", "featured-posts-grid")}
						__nextHasNoMarginBottom
					>
						<ColorPalette
							value={border.color}
							onChange={(value) =>
								setAttributes({
									cardBorder: {
										...border,
										color: value || undefined,
									},
								})
							}
						/>
					</BaseControl>
				</div>

				<div className="dfpg-control-group">
					<SelectControl
						label={__("Style", "featured-posts-grid")}
						value={border.style || ""}
						options={[
							{ label: __("Default", "featured-posts-grid"), value: "" },
							{ label: __("Solid", "featured-posts-grid"), value: "solid" },
							{ label: __("Dashed", "featured-posts-grid"), value: "dashed" },
							{ label: __("Dotted", "featured-posts-grid"), value: "dotted" },
							{ label: __("Double", "featured-posts-grid"), value: "double" },
							{ label: __("None", "featured-posts-grid"), value: "none" },
						]}
						onChange={(value) =>
							setAttributes({
								cardBorder: {
									...border,
									style: value || undefined,
								},
							})
						}
					/>
				</div>

				<div className="dfpg-control-group">
					<BoxControl
						label={__("Width", "featured-posts-grid")}
						values={borderWidth}
						onChange={(value) =>
							setAttributes({
								cardBorder: {
									...border,
									width: value || {},
								},
							})
						}
					/>
				</div>
			</ToolsPanelItem>

			<ToolsPanelItem
				label={__("Radius", "featured-posts-grid")}
				hasValue={() => !!cardBorderRadius?.value}
				onDeselect={() => setAttributes({ cardBorderRadius: {} })}
			>
				<div className="dfpg-control-group">
					<UnitControl
						label={__("Radius", "featured-posts-grid")}
						value={cardBorderRadius?.value || ""}
						onChange={(value) =>
							setAttributes({
								cardBorderRadius: {
									value: value || undefined,
								},
							})
						}
					/>
				</div>
			</ToolsPanelItem>
		</ToolsPanel>
	);
};

export default function Edit({ attributes, setAttributes }) {
	const {
		postIds = [],
		columns,
		showExcerpt,
		showFeaturedImage,
		imageAspectRatio,
		imageSize,
		excerptClamp,
		titleFontSize,
		titleFontWeight,
		titleLineHeight,
		titleLetterSpacing,
		titleTextTransform,
		excerptFontSize,
		excerptFontWeight,
		excerptLineHeight,
		excerptLetterSpacing,
		excerptTextTransform,
		rowGap,
		columnGap,
		cardPadding = {},
		cardBorder = {},
		cardBorderRadius = {},
	} = attributes;

	const [searchTerm, setSearchTerm] = useState("");

	const selectedPosts = useSelect(
		(select) => {
			if (!postIds.length) {
				return [];
			}

			return select("core").getEntityRecords("postType", "post", {
				include: postIds,
				per_page: MAX_POSTS,
				orderby: "include",
				_embed: true,
			});
		},
		[postIds],
	);

	const searchResults = useSelect(
		(select) => {
			if (!searchTerm) {
				return [];
			}

			return select("core").getEntityRecords("postType", "post", {
				search: searchTerm,
				per_page: 10,
				status: "publish",
				_embed: true,
			});
		},
		[searchTerm],
	);

	const searchOptions = useMemo(() => {
		if (!searchResults) {
			return [];
		}

		return searchResults
			.filter((post) => !postIds.includes(post.id))
			.map((post) => ({
				value: post.id,
				label: getPostTitle(post),
			}));
	}, [searchResults, postIds]);

	const orderedPosts = useMemo(() => {
		if (!selectedPosts) {
			return null;
		}

		return postIds
			.map((postId) => selectedPosts.find((post) => post.id === postId))
			.filter(Boolean);
	}, [selectedPosts, postIds]);

	const cardStyle = getCardStyle(attributes);

	const addPost = (postId) => {
		if (!postId || postIds.includes(postId) || postIds.length >= MAX_POSTS) {
			return;
		}

		setAttributes({
			postIds: [...postIds, Number(postId)],
		});
	};

	const removePost = (postId) => {
		setAttributes({
			postIds: postIds.filter((id) => id !== postId),
		});
	};

	const movePost = (postId, direction) => {
		const currentIndex = postIds.indexOf(postId);
		const nextIndex = currentIndex + direction;

		if (currentIndex < 0 || nextIndex < 0 || nextIndex >= postIds.length) {
			return;
		}

		const nextPostIds = [...postIds];
		const [movedPostId] = nextPostIds.splice(currentIndex, 1);

		nextPostIds.splice(nextIndex, 0, movedPostId);

		setAttributes({
			postIds: nextPostIds,
		});
	};

	const blockProps = useBlockProps({
		className: [
			"dfpg-featured-posts-grid",
			`dfpg-columns-${columns}`,
			`dfpg-image-ratio-${imageAspectRatio}`,
			excerptClamp !== "none" ? `dfpg-excerpt-clamp-${excerptClamp}` : "",
		]
			.filter(Boolean)
			.join(" "),
		style: getWrapperStyle(attributes),
	});

	return (
		<>
			<InspectorControls group="settings">
				<PanelBody
					title={__("Content", "featured-posts-grid")}
					initialOpen={true}
				>
					<ComboboxControl
						label={__("Search posts", "featured-posts-grid")}
						value=""
						options={searchOptions}
						onChange={addPost}
						onFilterValueChange={setSearchTerm}
						disabled={postIds.length >= MAX_POSTS}
					/>

					{postIds.length >= MAX_POSTS && (
						<p className="dfpg-editor-help">
							{__("Maximum of 6 posts selected.", "featured-posts-grid")}
						</p>
					)}

					{orderedPosts?.length > 0 && (
						<div className="dfpg-selected-posts">
							{orderedPosts.map((post, index) => (
								<div className="dfpg-selected-post" key={post.id}>
									<span>{getPostTitle(post)}</span>

									<div className="dfpg-selected-post-actions">
										<Button
											icon={chevronLeft}
											label={__("Move left", "featured-posts-grid")}
											disabled={index === 0}
											onClick={() => movePost(post.id, -1)}
											size="small"
										/>

										<Button
											icon={chevronRight}
											label={__("Move right", "featured-posts-grid")}
											disabled={index === postIds.length - 1}
											onClick={() => movePost(post.id, 1)}
											size="small"
										/>

										<Button
											isDestructive
											variant="link"
											onClick={() => removePost(post.id)}
										>
											{__("Remove", "featured-posts-grid")}
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
				</PanelBody>

				<PanelBody title={__("Layout", "featured-posts-grid")}>
					<SelectControl
						label={__("Columns", "featured-posts-grid")}
						value={columns}
						options={[
							{ label: __("2 columns", "featured-posts-grid"), value: 2 },
							{ label: __("3 columns", "featured-posts-grid"), value: 3 },
						]}
						onChange={(value) => setAttributes({ columns: Number(value) })}
					/>

					<ToggleControl
						label={__("Show featured image", "featured-posts-grid")}
						checked={showFeaturedImage}
						onChange={(value) => setAttributes({ showFeaturedImage: value })}
					/>

					{showFeaturedImage && (
						<>
							<SelectControl
								label={__("Image aspect ratio", "featured-posts-grid")}
								value={imageAspectRatio}
								options={[
									{ label: "4:3", value: "4-3" },
									{ label: "16:9", value: "16-9" },
									{ label: "1:1", value: "1-1" },
									{ label: "3:4", value: "3-4" },
								]}
								onChange={(value) =>
									setAttributes({ imageAspectRatio: value })
								}
							/>

							<SelectControl
								label={__("Image size", "featured-posts-grid")}
								value={imageSize}
								options={[
									{
										label: __("Thumbnail", "featured-posts-grid"),
										value: "thumbnail",
									},
									{
										label: __("Medium", "featured-posts-grid"),
										value: "medium",
									},
									{
										label: __("Large", "featured-posts-grid"),
										value: "large",
									},
									{
										label: __("Full", "featured-posts-grid"),
										value: "full",
									},
								]}
								onChange={(value) => setAttributes({ imageSize: value })}
							/>
						</>
					)}

					<ToggleControl
						label={__("Show excerpt", "featured-posts-grid")}
						checked={showExcerpt}
						onChange={(value) => setAttributes({ showExcerpt: value })}
					/>

					{showExcerpt && (
						<SelectControl
							label={__("Excerpt line clamp", "featured-posts-grid")}
							value={excerptClamp}
							options={[
								{ label: __("None", "featured-posts-grid"), value: "none" },
								{ label: "2", value: "2" },
								{ label: "3", value: "3" },
								{ label: "4", value: "4" },
							]}
							onChange={(value) => setAttributes({ excerptClamp: value })}
						/>
					)}
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="styles">
				<TypographyPanel
					title={__("Post Title Typography", "featured-posts-grid")}
					fontSize={titleFontSize}
					fontWeight={titleFontWeight}
					lineHeight={titleLineHeight}
					letterSpacing={titleLetterSpacing}
					textTransform={titleTextTransform}
					onChange={(value) =>
						setAttributes({
							titleFontSize: hasOwn(value, "fontSize")
								? value.fontSize
								: titleFontSize,
							titleFontWeight: hasOwn(value, "fontWeight")
								? value.fontWeight
								: titleFontWeight,
							titleLineHeight: hasOwn(value, "lineHeight")
								? value.lineHeight
								: titleLineHeight,
							titleLetterSpacing: hasOwn(value, "letterSpacing")
								? value.letterSpacing
								: titleLetterSpacing,
							titleTextTransform: hasOwn(value, "textTransform")
								? value.textTransform
								: titleTextTransform,
						})
					}
				/>

				<TypographyPanel
					title={__("Post Excerpt Typography", "featured-posts-grid")}
					fontSize={excerptFontSize}
					fontWeight={excerptFontWeight}
					lineHeight={excerptLineHeight}
					letterSpacing={excerptLetterSpacing}
					textTransform={excerptTextTransform}
					onChange={(value) =>
						setAttributes({
							excerptFontSize: hasOwn(value, "fontSize")
								? value.fontSize
								: excerptFontSize,
							excerptFontWeight: hasOwn(value, "fontWeight")
								? value.fontWeight
								: excerptFontWeight,
							excerptLineHeight: hasOwn(value, "lineHeight")
								? value.lineHeight
								: excerptLineHeight,
							excerptLetterSpacing: hasOwn(value, "letterSpacing")
								? value.letterSpacing
								: excerptLetterSpacing,
							excerptTextTransform: hasOwn(value, "textTransform")
								? value.textTransform
								: excerptTextTransform,
						})
					}
				/>

				<DimensionsPanel
					cardPadding={cardPadding}
					columnGap={columnGap}
					rowGap={rowGap}
					setAttributes={setAttributes}
				/>

				<BorderPanel
					cardBorder={cardBorder}
					cardBorderRadius={cardBorderRadius}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			<div {...blockProps}>
				{orderedPosts === null && <Spinner />}

				{orderedPosts?.length === 0 && (
					<div className="dfpg-empty-state">
						<p>
							{__(
								"Search and select posts from the block sidebar.",
								"featured-posts-grid",
							)}
						</p>
					</div>
				)}

				{orderedPosts?.length > 0 && (
					<div className="dfpg-grid">
						{orderedPosts.map((post) => {
							const image = getFeaturedImage(post, imageSize);

							return (
								<article className="dfpg-card" style={cardStyle} key={post.id}>
									{showFeaturedImage && image?.url && (
										<figure className="dfpg-card-image">
											<img
												src={image.url}
												alt={image.alt}
												loading="lazy"
												decoding="async"
											/>
										</figure>
									)}

									<header className="dfpg-card-header">
										<h3 className="dfpg-card-title">
											<a href={post.link}>{getPostTitle(post)}</a>
										</h3>
									</header>

									{showExcerpt && getPostExcerpt(post) && (
										<div className="dfpg-card-content">
											<p className="dfpg-card-excerpt">
												{getPostExcerpt(post)}
											</p>
										</div>
									)}
								</article>
							);
						})}
					</div>
				)}
			</div>
		</>
	);
}