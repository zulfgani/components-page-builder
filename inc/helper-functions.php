<?php
if ( !function_exists( 'classic_wrap_first_word' ) ) {
	/**
	 * Wrap the first word of a string in a <span> tag for styling
	 *
	 * @since 1.0.0
	 */
	function classic_wrap_first_word( $string ) {

		$words = explode( ' ', $string );
		$first = $words[0];

		$rest = '';
		if ( count( $words ) > 1 ) {
			$rest = join( ' ', array_splice( $words, 1 ) );
		}

		return '<span class="classic-first-word">' . $first . '</span>' . $rest;
	}
}

if ( !function_exists( 'chb_get_attachment_img_src_url' ) ) {
	/**
	 * Retrive the URL for an attachment image
	 *
	 * @since 0.0.1
	 */
	function chb_get_attachment_img_src_url( $attachment_id, $size ) {
		$img = wp_get_attachment_image_src( $attachment_id, $size );
		return $img[0];
	}
}

if ( ! function_exists( 'components_posted_on' ) ) {
	/**
	 * Prints HTML with meta information for the current post-date/time.
	 */
	function components_posted_on() {
		$time_string = '<time class="entry-date published updated" datetime="%1$s">%2$s</time>';
		if ( get_the_time( 'U' ) !== get_the_modified_time( 'U' ) ) {
			$time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time><time class="updated" datetime="%3$s">%4$s</time>';
		}

		$time_string = sprintf( $time_string,
			esc_attr( get_the_date( 'c' ) ),
			esc_html( get_the_date() ),
			esc_attr( get_the_modified_date( 'c' ) ),
			esc_html( get_the_modified_date() )
		);
		
		$posted_on = '<a href="' . esc_url( get_permalink() ) . '" rel="bookmark">' . $time_string . '</a>';
		echo '<span class="posted-on">' . $posted_on . '</span>'; // WPCS: XSS OK.

	}
}

