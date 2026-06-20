<?php
/**
 * Plugin Name:       Featured Posts Grid
 * Description:       Adds a dynamic Gutenberg block for displaying selected posts in a responsive grid.
 * Version:           1.0.0
 * Requires at least: 6.4
 * Tested up to:      7.0
 * Requires PHP:      7.4
 * Author:            Darko Stojisavljevic
 * Author URI:        https://darko.sparkwebservices.com/
 * Text Domain:       featured-posts-grid
 * Domain Path:       /languages
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 *
 * @package FeaturedPostsGrid
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Render the Featured Posts Grid block.
 *
 * @param array $attributes Block attributes.
 * @return string
 */
function dfpg_render_featured_posts_grid_block( array $attributes ): string {
	$render_file = __DIR__ . '/build/render.php';

	if ( ! file_exists( $render_file ) ) {
		return '';
	}

	// The render file returns the final block markup.
	$rendered_block = require $render_file;

	return is_string( $rendered_block ) ? $rendered_block : '';
}

/**
 * Register the block from the built files.
 *
 * @return void
 */
function dfpg_register_featured_posts_grid_block(): void {
	register_block_type(
		__DIR__ . '/build',
		array(
			'render_callback' => 'dfpg_render_featured_posts_grid_block',
		)
	);
}
add_action( 'init', 'dfpg_register_featured_posts_grid_block' );