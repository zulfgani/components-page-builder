# Components Page Builder
A ClassicPress plugin which bundles the [content-layout-control](https://github.com/NateWr/content-layout-control) library for beautiful page layouts, and implements common page blocks for any theme that supports it.

# Based on Theme of the Crop - Layout Control

For more information, [contact me here](https://cpengineered.com/contact).

# Add theme support for the builder

Note: $theme_name should be predifined within the theme itself else replace it with a hard printed name!
```
if ( class_exists( 'totclcInit' ) ) {
	add_theme_support( 
		'components-page-builder', [
			'components' => [
				'classic-hero-block',
				'classic-content-block',
				'classic-content-block-two',
				'classic-cta-banner',
				'classic-cta-banner-two',					
				'classic-recent-posts',
				'gallery',
				'classic-commerce-products',
			],
			'control_title' => __( $theme_name .' Page Components', 'totc-layout-control' ),
		] 
	);
	
}
```

# TODO List
The builder in its current from is to be considered very young,primitive in nature and very much a beta version as it requires a lot of features added in

## Color controls

## WYSIWYG editor controls

## Repeater controls

## Font selector controls

## Icon selector controls

## Adjustment i.e. margin/padding controls

## Ability to edit added links/buttons

## Translation

## JS, CSS and general code tidy up

## And many more yet to be thought of features :) 

The above will need all community hands on deck to help out in any capacity possible

## Changelog

### 0.0.1 (2019-12-27)
* Initial beta release
