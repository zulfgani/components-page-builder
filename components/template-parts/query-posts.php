<?php

	/**
	 * Filter the arguments for the Recent Posts component.
	 *
	 * @since 1.0.0
	 *
	 * @see WP_Query::get_posts()
	 *
	 * @param array $args An array of arguments used to retrieve the recent posts.
	 */
	$query = new WP_Query( apply_filters( 'classic_recent_posts_args', array(
		'posts_per_page'      	=> $number,
		'no_found_rows'       	=> true,
		'post_status'         	=> 'publish',
		'ignore_sticky_posts' 	=> true
	) ) );

	if ($query->have_posts()) :
		
		while ( $query->have_posts() ) : $query->the_post(); ?>			

			<article id="post-<?php the_ID(); ?>" <?php post_class( ); ?>>
				<header class="entry-header">						
					<?php 
					if ( $show_thumb && '' != get_the_post_thumbnail() ) {
						echo '<div class="entry-thumbnail"><a href="' . esc_url( get_permalink() ) . '">';
							the_post_thumbnail( 'medium' );
						echo '</a></div>';
					}
					the_title( '<div class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></div>' );
					
					if ( $show_date && get_post_type() == 'post' ) {
						echo '<div class="entry-meta">';							
							components_posted_on();
						echo '</div>';
					 
					}
					?>
				</header><!-- .entry-header -->

				<div class="entry-content">
				<?php 
					$excerpt = get_the_excerpt();
					$excerpt = substr($excerpt, 0, $excerpt_limit);
					$output = substr($excerpt, 0, strrpos($excerpt, ' '));
					echo $output;
				?>
				</div><!-- .entry-content -->

				<?php if ( $show_readmore ) { ?>
				<span class="read-more">
				<a href="<?php echo esc_url( get_permalink() ); ?>">
					<?php
						// Translators: 1 and 3 are an opening and closing <span> tag. 2 is the post title.
						printf( esc_html__( 'Read More%1$s about %2$s%3$s', 'classic-homepage-builder' ), '<span class="screen-reader-text">', get_the_title(), '</span>' );
					?>
				</a>
				</span>
				<?php } ?>
			</article><!-- #post-## -->
		
	<?php 
		endwhile; 
		// Reset the global $the_post as this query will have stomped on it
		wp_reset_postdata();

	endif;