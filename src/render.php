<?php
/**
 * Server-side render callback for Featured Posts Grid.
 *
 * @package FeaturedPostsGrid
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'dfpg_sanitize_css_value' ) ) {
	/**
	 * Sanitize a CSS value stored in block attributes.
	 *
	 * @param mixed $value CSS value.
	 * @return string
	 */
	function dfpg_sanitize_css_value( $value ): string {
		if ( ! is_scalar( $value ) ) {
			return '';
		}

		return sanitize_text_field( wp_unslash( (string) $value ) );
	}
}

if ( ! function_exists( 'dfpg_get_card_style_attribute' ) ) {
	/**
	 * Build inline styles for each post card.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	function dfpg_get_card_style_attribute( array $attributes ): string {
		$card_padding       = isset( $attributes['cardPadding'] ) && is_array( $attributes['cardPadding'] ) ? $attributes['cardPadding'] : array();
		$card_border        = isset( $attributes['cardBorder'] ) && is_array( $attributes['cardBorder'] ) ? $attributes['cardBorder'] : array();
		$card_border_radius = isset( $attributes['cardBorderRadius'] ) && is_array( $attributes['cardBorderRadius'] ) ? $attributes['cardBorderRadius'] : array();

		$border_width = isset( $card_border['width'] ) && is_array( $card_border['width'] ) ? $card_border['width'] : array();

		$styles = array();

		if ( ! empty( $card_padding['top'] ) ) {
			$styles[] = 'padding-top:' . dfpg_sanitize_css_value( $card_padding['top'] );
		}

		if ( ! empty( $card_padding['right'] ) ) {
			$styles[] = 'padding-right:' . dfpg_sanitize_css_value( $card_padding['right'] );
		}

		if ( ! empty( $card_padding['bottom'] ) ) {
			$styles[] = 'padding-bottom:' . dfpg_sanitize_css_value( $card_padding['bottom'] );
		}

		if ( ! empty( $card_padding['left'] ) ) {
			$styles[] = 'padding-left:' . dfpg_sanitize_css_value( $card_padding['left'] );
		}

		if ( ! empty( $card_border['color'] ) ) {
			$border_color = sanitize_text_field( wp_unslash( (string) $card_border['color'] ) );

			if ( '' !== $border_color ) {
				$styles[] = 'border-color:' . esc_attr( $border_color );
			}
		}

		if ( ! empty( $card_border['style'] ) ) {
			$allowed_border_styles = array( 'solid', 'dashed', 'dotted', 'double', 'none' );
			$border_style          = sanitize_key( $card_border['style'] );

			if ( in_array( $border_style, $allowed_border_styles, true ) ) {
				$styles[] = 'border-style:' . $border_style;
			}
		}

		if ( ! empty( $border_width['top'] ) ) {
			$styles[] = 'border-top-width:' . dfpg_sanitize_css_value( $border_width['top'] );
		}

		if ( ! empty( $border_width['right'] ) ) {
			$styles[] = 'border-right-width:' . dfpg_sanitize_css_value( $border_width['right'] );
		}

		if ( ! empty( $border_width['bottom'] ) ) {
			$styles[] = 'border-bottom-width:' . dfpg_sanitize_css_value( $border_width['bottom'] );
		}

		if ( ! empty( $border_width['left'] ) ) {
			$styles[] = 'border-left-width:' . dfpg_sanitize_css_value( $border_width['left'] );
		}

		if ( ! empty( $card_border_radius['value'] ) ) {
			$styles[] = 'border-radius:' . dfpg_sanitize_css_value( $card_border_radius['value'] );
		}

		return implode( ';', array_filter( $styles ) );
	}
}

$post_ids = isset( $attributes['postIds'] ) && is_array( $attributes['postIds'] )
	? array_slice( array_map( 'absint', $attributes['postIds'] ), 0, 6 )
	: array();

if ( empty( $post_ids ) ) {
	return '';
}

$columns = isset( $attributes['columns'] ) ? absint( $attributes['columns'] ) : 3;
$columns = in_array( $columns, array( 2, 3 ), true ) ? $columns : 3;

$show_excerpt        = isset( $attributes['showExcerpt'] ) ? (bool) $attributes['showExcerpt'] : true;
$show_featured_image = isset( $attributes['showFeaturedImage'] ) ? (bool) $attributes['showFeaturedImage'] : true;

$image_aspect_ratio = isset( $attributes['imageAspectRatio'] ) ? sanitize_key( $attributes['imageAspectRatio'] ) : '4-3';
$allowed_ratios     = array( '4-3', '16-9', '1-1', '3-4' );

if ( ! in_array( $image_aspect_ratio, $allowed_ratios, true ) ) {
	$image_aspect_ratio = '4-3';
}

$image_size = isset( $attributes['imageSize'] ) ? sanitize_key( $attributes['imageSize'] ) : 'large';

$excerpt_clamp         = isset( $attributes['excerptClamp'] ) ? sanitize_key( $attributes['excerptClamp'] ) : 'none';
$allowed_excerpt_clamp = array( 'none', '2', '3', '4' );

if ( ! in_array( $excerpt_clamp, $allowed_excerpt_clamp, true ) ) {
	$excerpt_clamp = 'none';
}

$custom_styles = array();

$style_map = array(
	'titleFontSize'        => '--dfpg-title-font-size',
	'titleFontWeight'      => '--dfpg-title-font-weight',
	'titleLineHeight'      => '--dfpg-title-line-height',
	'titleLetterSpacing'   => '--dfpg-title-letter-spacing',
	'titleTextTransform'   => '--dfpg-title-text-transform',
	'excerptFontSize'      => '--dfpg-excerpt-font-size',
	'excerptFontWeight'    => '--dfpg-excerpt-font-weight',
	'excerptLineHeight'    => '--dfpg-excerpt-line-height',
	'excerptLetterSpacing' => '--dfpg-excerpt-letter-spacing',
	'excerptTextTransform' => '--dfpg-excerpt-text-transform',
	'rowGap'               => '--dfpg-row-gap',
	'columnGap'            => '--dfpg-column-gap',
);

foreach ( $style_map as $attribute_key => $css_variable ) {
	if ( ! empty( $attributes[ $attribute_key ] ) && is_scalar( $attributes[ $attribute_key ] ) ) {
		$value           = dfpg_sanitize_css_value( $attributes[ $attribute_key ] );
		$custom_styles[] = $css_variable . ':' . esc_attr( $value );
	}
}

$wrapper_classes = array(
	'dfpg-featured-posts-grid',
	'dfpg-columns-' . $columns,
	'dfpg-image-ratio-' . $image_aspect_ratio,
);

if ( 'none' !== $excerpt_clamp ) {
	$wrapper_classes[] = 'dfpg-excerpt-clamp-' . $excerpt_clamp;
}

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => implode( ' ', $wrapper_classes ),
		'style' => implode( ';', $custom_styles ),
	)
);

$card_style = dfpg_get_card_style_attribute( $attributes );

$query = new WP_Query(
	array(
		'post_type'           => 'post',
		'post_status'         => 'publish',
		'post__in'            => $post_ids,
		'orderby'             => 'post__in',
		'posts_per_page'      => count( $post_ids ),
		'ignore_sticky_posts' => true,
		'no_found_rows'       => true,
	)
);

if ( ! $query->have_posts() ) {
	return '';
}

ob_start();
?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="dfpg-grid">
		<?php
		while ( $query->have_posts() ) :
			$query->the_post();

			$post_id    = get_the_ID();
			$post_title = get_the_title( $post_id );
			$post_url   = get_permalink( $post_id );

			$excerpt = has_excerpt( $post_id )
				? get_the_excerpt( $post_id )
				: wp_trim_words( wp_strip_all_tags( get_post_field( 'post_content', $post_id ) ), 24, '…' );

			$thumbnail_id = get_post_thumbnail_id( $post_id );
			$image_alt    = '';

			if ( $thumbnail_id ) {
				$image_alt = get_post_meta( $thumbnail_id, '_wp_attachment_image_alt', true );
				$image_alt = '' !== $image_alt ? $image_alt : $post_title;
			}
			?>
			<article class="dfpg-card"<?php echo $card_style ? ' style="' . esc_attr( $card_style ) . '"' : ''; ?>>
				<?php if ( $show_featured_image && $thumbnail_id ) : ?>
					<figure class="dfpg-card-image">
						<?php
						// The brief only requires the post title to be linked.
						echo get_the_post_thumbnail(
							$post_id,
							$image_size,
							array(
								'alt'      => $image_alt,
								'loading'  => 'lazy',
								'decoding' => 'async',
							)
						);
						?>
					</figure>
				<?php endif; ?>

				<header class="dfpg-card-header">
					<h3 class="dfpg-card-title">
						<a href="<?php echo esc_url( $post_url ); ?>">
							<?php echo esc_html( $post_title ); ?>
						</a>
					</h3>
				</header>

				<?php if ( $show_excerpt && $excerpt ) : ?>
					<div class="dfpg-card-content">
						<p class="dfpg-card-excerpt"><?php echo esc_html( $excerpt ); ?></p>
					</div>
				<?php endif; ?>
			</article>
		<?php endwhile; ?>
	</div>
</div>

<?php
wp_reset_postdata();

return ob_get_clean();