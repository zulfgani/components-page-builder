<?php

defined( 'ABSPATH' ) || exit;

class totclcInit {

	/**
	 * The single instance of this class
	 *
	 * @param totclcInit
	 */
	private static $instance;

	/**
	 * Path to the plugin directory
	 *
	 * @param string
	 */
	static $plugin_dir;

	/**
	 * URL to the plugin
	 *
	 * @param string
	 */
	static $plugin_url;

	/**
	 * Create or retrieve the single instance of the class
	 *
	 * @since 0.1.0
	 */
	public static function instance() {

		if ( !isset( self::$instance ) ) {

			self::$instance = new totclcInit();

			self::$plugin_dir = untrailingslashit( plugin_dir_path( __FILE__ ) );
			self::$plugin_url = untrailingslashit( plugin_dir_url( __FILE__ ) );

			self::$instance->init();
		}

		return self::$instance;
	}

	/**
	 * Initialize the plugin and register hooks
	 *
	 * @since 0.1.0
	 */
	public function init() {

		add_action( 'init', array( $this, 'load_textdomain' ) );
		add_action( 'after_setup_theme', array( $this, 'load_controller' ), 100 );
		
	}

	/**
	 * Load the plugin textdomain for localistion
	 *
	 * @since 0.1.0
	 */
	public function load_textdomain() {
		load_plugin_textdomain( 'components-page-builder', false, plugin_basename( dirname( __FILE__ ) ) . '/languages/' );
	}

	/**
	 * Load the content-layout-control controller class
	 *
	 * @since 0.1.0
	 */
	public function load_controller() {

		if ( !get_theme_support( 'components-page-builder' ) ) {
			return;
		}
		
		include_once( self::$plugin_dir . '/inc/customizer/ajax-handler.php' );

		include_once( self::$plugin_dir . '/core/content-layout-control/content-layout-control.php' );
		$args['url'] = self::$plugin_url . '/core/content-layout-control';
		CLC_Content_Layout_Control(
			array(
				'url'  => self::$plugin_url . '/core/content-layout-control',
				'i18n' => array(
					'delete'         => esc_html__( 'Delete', 'totc-layout-control' ),
					'control-toggle' => esc_html__( 'Open/close this component', 'totc-layout-control' ),
				)
			)
		);

		add_filter( 'clc_register_components', array( $this, 'register_components' ) );
		add_filter( 'customize_register', array( $this, 'customize_register' ) );
		add_filter( 'clc_component_render_template_dirs', array( $this, 'add_render_template_dir' ) );
		add_filter( 'clc_component_control_template_dirs', array( $this, 'add_control_template_dir' ) );

		// Adjust homepage editing screen
		add_action( 'admin_head', array( $this, 'maybe_control_post_edit' ) );
		add_action( 'wpseo_metabox_prio', array( $this, 'maybe_move_yoast_metabox' ) );
		
	}

	/**
	 * Register the layout components provided by this plugin
	 *
	 * @param array Components already registered
	 * @since 0.1.0
	 */
	public function register_components( $components ) {
		
		$content_block_i18n = array(
			'title'                 => esc_html__( 'Title', 'components' ),
			'content'               => esc_html__( 'Content', 'components' ),
			'image'                 => esc_html__( 'Image', 'components' ),
			'image_placeholder'     => esc_html__( 'No image selected', 'components' ),
			'image_position'        => esc_html__( 'Image Position', 'components' ),
			'image_position_left'   => esc_html__( 'Align Left', 'components' ),
			'image_position_right'  => esc_html__( 'Align Right', 'components' ),
			'image_select_button'   => esc_html__( 'Select Image', 'components' ),
			'image_change_button'   => esc_html__( 'Change Image', 'components' ),
			'image_remove_button'   => esc_html__( 'Remove', 'components' ),
			'links'                 => esc_html__( 'Buttons', 'components' ),
			'links_add_button'      => esc_html__( 'Add Button', 'components' ),
			'links_remove_button'   => esc_html__( 'Remove', 'components' ),
			'selector_id' 			=> esc_attr__( 'Unique CSS ID', 'components' ),
			'excerpt_limit'         => esc_html__( 'Excerpt Length', 'components' ),
		);
		
		$supported_components = $this->get_theme_support( 'components' );

		foreach( $supported_components as $component ) {
			
			switch( $component ) {

				case 'classic-hero-block':
					$components['classic-hero-block'] = array(
						'file'        => self::$plugin_dir . '/components/classic-hero-block.php',
						'class'       => 'Classic_CLC_Component_Hero_Block',
						'name'        => __( 'Hero Block', 'components' ),
						'description' => __( 'A prominent call to action on a full-width background image.', 'components' ),
						'i18n'        => array_merge(
							$content_block_i18n,
							array(
								'title_line_one'                => esc_attr__( 'Title (top)', 'components' ),
								'title'                         => esc_attr__( 'Title (bottom)', 'components' ),
								'contact'                       => esc_attr__( 'Contact Detail', 'components' ),
								'none'                          => esc_attr__( 'None', 'components' ),
								'phone'                         => esc_attr__( 'Phone Number', 'components' ),
								'find'                          => esc_attr__( 'Contact Link', 'components' ),
								'find_text_default'             => esc_attr__( 'Find Us', 'components' ),
								'image_transparency'            => esc_attr__( 'Darken Image', 'components' ),
							)
						),
					);
					break;
					
				case 'classic-content-block':
					$components['classic-content-block'] = array(
						'file'        => self::$plugin_dir . '/components/classic-content-block.php',
						'class'       => 'Classic_CLC_Component_Content_Block',
						'name'        => esc_html__( 'Content Block', 'components' ),
						'description' => esc_html__( 'A simple content block with an image, title, text and buttons.', 'components' ),
						'i18n'        => array_merge(
							$content_block_i18n,
							array(
								'title_line_one' 				=> esc_attr__( 'Title (top)', 'components' ),
								'title' 						=> esc_attr__( 'Title (bottom)', 'components' ),
							)
						),
					);
					break;
					
				case 'classic-content-block-two':
					$components['classic-content-block-two'] = array(
						'file'        => self::$plugin_dir . '/components/classic-content-block-two.php',
						'class'       => 'Classic_CLC_Component_Content_Block_Two',
						'name'        => esc_html__( 'Content Block 2', 'components' ),
						'description' => esc_html__( 'A simple content block with an image, title, text and buttons.', 'components' ),
						'i18n'        => array_merge(
							$content_block_i18n,
							array(
								'title_line_one' => esc_attr__( 'Title', 'components' ),
							)
						),
					);
					break;
				
				case 'gallery' :
					$components['gallery'] = array(
						'file' 			=> self::$plugin_dir . '/components/gallery.php',
						'class' 		=> 'CLC_Component_Gallery',
						'name' 			=> esc_html__( 'Photo Gallery', 'totc-layout-control' ),
						'columns' 		=> 5,
						'description' 	=> esc_html__( 'Showcase a collection of images.', 'totc-layout-control' ),
						'i18n' 			=>  array(
							'title' 				=> __( 'Title', 'totc-layout-control' ),
							'image'                	=> esc_html__( 'Images', 'totc-layout-control' ),
							'columns_label' 		=> esc_html__( 'Columns Per Row', 'totc-layout-control' ),
							'background_color' 		=> esc_html__( 'Background Color', 'totc-layout-control' ),
							'image_placeholder'    	=> esc_html__( 'No images selected', 'totc-layout-control' ),
							'image_select_button'  	=> esc_html__( 'Select Images', 'totc-layout-control' ),
							'image_change_button'  	=> esc_html__( 'Change Images', 'totc-layout-control' ),
							'selector_id' 			=> esc_attr__( 'Unique CSS ID', 'components' ),
						),
					);
					break;
					
				case 'classic-cta-banner':
					$components['classic-cta-banner'] = array(
						'file'        => self::$plugin_dir . '/components/classic-cta-banner.php',
						'class'       => 'Classic_CLC_Component_CTA_Banner',
						'name'        => esc_html__( 'Call To Action', 'components' ),
						'description' => esc_html__( 'A simple content block with text and button(s).', 'components' ),
						'i18n'        => array_merge(
							$content_block_i18n,
							array(
								'title_line_one' 		=> esc_attr__( 'Title (Internal use only)', 'components' ),
								'image_transparency'	=> esc_attr__( 'Darken Image', 'components' ),
							)
						),
					);
					break;
					
				case 'classic-cta-banner-two':
					$components['classic-cta-banner-two'] = array(
						'file'        => self::$plugin_dir . '/components/classic-cta-banner-two.php',
						'class'       => 'Classic_CLC_Component_CTA_Banner_Two',
						'name'        => esc_html__( 'Call To Action 2', 'components' ),
						'description' => esc_html__( 'A simple content block with text and button(s).', 'components' ),
						'i18n'        => array_merge(
							$content_block_i18n,
							array(
								'title_line_one' 		=> esc_attr__( 'Title (Internal use only)', 'components' ),
								'image_transparency'	=> esc_attr__( 'Darken Image', 'components' ),
							)
						),
					);
					break;
					
				case 'classic-recent-posts' :
					$components['classic-recent-posts'] = array(
						'file' => self::$plugin_dir . '/components/classic-recent-posts.php',
						'class' => 'Classic_Component_RecentPosts',
						'name' => esc_html__( 'Recent Posts', 'totc-layout-control' ),
						'limit_posts' => 10,
						'limit_columns' => 4,
						'description' => esc_html__( 'A list of your most recent posts.', 'totc-layout-control' ),
						'i18n'          => array(
							'title' 			=> __( 'Title', 'totc-layout-control' ),
							'number_label' 		=> __( 'Number of posts to show', 'totc-layout-control' ),
							'thumb_label' 		=> __( 'Display the featured image.', 'totc-layout-control' ),
							'show_date' 		=> __( 'Display the published date with each post.', 'totc-layout-control' ),
							'readmore_label' 	=> __( 'Display Read More button.', 'totc-layout-control' ),
							'columns_label' 	=> __( 'Number of columns.', 'totc-layout-control' ),
							'excerpt_limit' 	=> __( 'Excerpt Limit (number of characters to show).', 'totc-layout-control' ),
						),
					);
					break;
					
				case 'classic-commerce-products' :
					if( class_exists( 'WooCommerce' ) ) {
						$components['classic-commerce-products'] = array(
							'file' => self::$plugin_dir . '/components/classic-commerce-products.php',
							'class' => 'Classic_Commerce_Products',
							'name' => esc_html__( 'ClassicCommerce Products', 'totc-layout-control' ),
							'description' => esc_html__( 'Display CC Products on the page.', 'totc-layout-control' ),
							'i18n'          => array(
								'title' => esc_html__( 'Title', 'totc-layout-control' ),
								'number_label' 		=> __( 'Number of products to show', 'totc-layout-control' ),
								'columns_label' 	=> __( 'Number of columns.', 'totc-layout-control' ),
								'selector_id' 			=> esc_attr__( 'Unique CSS ID', 'components' ),
							),
						);
					}
					break;
			}
		}

		return $components;
	}

	/**
	 * Register the content-layout-control with the customizer
	 *
	 * @since 0.1.0
	 */
	public function customize_register( $wp_customize ) {
		include_once( self::$plugin_dir . '/inc/customizer/WP_Customize_Scaled_Image_Control.php' );
		$wp_customize->register_control_type( 'Components_WP_Customize_Scaled_Image_Control' );

		$wp_customize->add_section(
			'content_layout_control',
			array(
				'capability' => 'edit_posts',
				'title' => $this->get_theme_support( 'control_title' ),
			)
		);

		$wp_customize->add_setting(
			'content_layout_control',
			array(
				'sanitize_callback' => 'CLC_Content_Layout_Control::sanitize',
				'transport' => 'postMessage',
				'type' => 'content_layout',
			)
		);

		$wp_customize->add_control(
			new CLC_WP_Customize_Content_Layout_Control(
				$wp_customize,
				'content_layout_control',
				array(
					'section' => 'content_layout_control',
					'priority' => 1,
					'components' => $this->get_theme_support( 'components' ),
					'active_callback' => $this->get_theme_support( 'active_callback' ),
					'i18n' => array(
						'add_component'                 => esc_html__( 'Add Component', 'clc-demo-theme' ),
						'edit_component'                => esc_html__( 'Edit Component', 'clc-demo-theme' ),
						'close'                         => esc_attr__( 'Close Panel', 'clc-demo-theme' ),
						'post_search_label'             => esc_html__( 'Search content', 'clc-demo-theme' ),
						'links_add_button'              => esc_html__( 'Add Link', 'clc-demo-theme' ),
						'links_url'                     => esc_html__( 'URL', 'clc-demo-theme' ),
						'links_text'                    => esc_html__( 'Link Text', 'clc-demo-theme' ),
						'links_search_existing_content' => esc_html__( 'Search existing content &rarr;', 'clc-demo-theme' ),
						'links_back'                    => esc_html__( '&larr; Back to link form', 'clc-demo-theme' ),
					),
				)
			)
		);
	}

	/**
	 * A callback function to display the editor only on the homepage
	 *
	 * @since 0.1.0
	 */
	static public function active_callback() {
		//$page_template == 'fullwidth.php';
		//return is_page() && is_front_page();
		return is_page(); //&& $page_template;
	}

	/**
	 * A callback function fired in the admin post editing screen to determine
	 * if the post being edited is the homepage
	 *
	 * @since 0.9.2
	 */
	static public function admin_active_callback( $post_id = null ) {

		if ( !$post_id ) {
			global $post;
			if ( isset( $post ) && get_class( $post ) === 'WP_Post' ) {
				$post_id = $post->ID;
			}

			if ( !$post_id ) {
				return false;
			}
		}

		$page_on_front = get_option( 'page_on_front' );
		if ( $post_id === $page_on_front ) {
			return true;
		}

		return false;
	}

	/**
	 * Add the directory for this plugin's component render templates
	 *
	 * @param array $dirs List of dirs to search in
	 * @since 0.1.0
	 */
	public function add_render_template_dir( $dirs ) {
		array_unshift( $dirs, self::$plugin_dir . '/components/templates' );
		return $dirs;
	}

	/**
	 * Add the directory for this plugin's component control templates
	 *
	 * @param array $dirs List of dirs to search in
	 * @since 0.1.0
	 */
	public function add_control_template_dir( $dirs ) {
		array_unshift( $dirs, self::$plugin_dir . '/js/templates/components' );
		return $dirs;
	}

	/**
	 * Print a hidden map using Business Profile's native functions to ensure
	 * that the map handler is loaded and initialized properly. This is used by
	 * the customizer to ensure that if a map is loaded in during customization,
	 * it will update properly.
	 *
	 * @since 0.1.0
	 */
	public function load_bpfwp_map_handlers() {

		if ( !function_exists( 'bpwfwp_print_map' ) ) {
			return;
		}
		?>

		<div style="display:none;">
			<?php bpwfwp_print_map(); ?>
		</div>

		<?php
	}

	/**
	 * Wrapper function for get_theme_support which queries specific support
	 * params
	 *
	 * @param string $setting Key in array of theme support values
	 * @since 0.1.0
	 */
	public function get_theme_support( $setting ) {

		$supports = get_theme_support( 'components-page-builder' );

		$defaults = array(
			'components' => array(
				'classic-hero-block',
				'classic-content-block',
				'classic-content-block-two',
				'classic-cta-banner',
				'classic-cta-banner-two',
				'classic-recent-posts',
				'gallery',
				'classic-commerce-products',
			),
			'active_callback' 		=> array( 'totclcInit', 'active_callback' ),
			'admin_active_callback' => array( 'totclcInit', 'admin_active_callback' ),
			'control_title' 		=> __( 'Page Components', 'totc-layout-control' ),
			'builder_name' 			=> __( 'Components Page Builder', 'totc-layout-control' ),
		);

		if ( !$supports ) {
			return isset( $defaults[$setting] ) ? $defaults[$setting] : null;
		}

		if ( is_array( $supports ) ) {
			$supports = reset( $supports );
		}

		if ( isset( $supports[$setting] ) ) {
			return $supports[$setting];
		} elseif ( isset( $defaults[$setting] ) ) {
			return $defaults[$setting];
		}
	}

	/**
	 * Maybe override the post editing screen for the homepage
	 *
	 * Hide or remove metaboxes from the homepage editing screen and add a
	 * metabox to point users to the customizer.
	 *
	 * @since 0.9.2
	 */
	public function maybe_control_post_edit() {

		$admin_active_callback = $this->get_theme_support( 'admin_active_callback' );
		if ( !call_user_func( $admin_active_callback ) ) {
			return;
		}

		$override = apply_filters( 'totclc_enable_post_editor_override', true );
		if ( !$override ) {
			return;
		}

		global $post;

		remove_post_type_support( $post->post_type, 'revisions' );
		//remove_meta_box( 'pageparentdiv', 'page', 'side' );
		remove_meta_box( 'authordiv', 'page', 'normal' );
		remove_meta_box( 'postcustom', 'page', 'normal' );
		remove_meta_box( 'postexcerpt', 'page', 'normal' );
		remove_meta_box( 'commentsdiv', 'page', 'normal' );
		remove_meta_box( 'postimagediv', 'page', 'side' );
		remove_meta_box( 'trackbacksdiv', 'page', 'normal' );
		remove_meta_box( 'commentsdiv', 'page', 'normal' );
		remove_meta_box( 'commentstatusdiv', 'page', 'normal' );
		remove_meta_box( 'revisionsdiv', 'page', 'normal' );
		remove_meta_box( 'slugdiv', 'page', 'normal' );
		remove_meta_box( 'wp_featherlight_options', 'page', 'side' );
		remove_meta_box( 'ninja_forms_selector', 'page', 'side' );
		remove_meta_box( 'nf_admin_metaboxes_appendaform', 'page', 'side' );

		// If Yoast SEO is not active, we can remove a couple other items
		if ( !defined( 'WPSEO_VERSION' ) ) {
			remove_post_type_support( $post->post_type, 'editor' );
			//remove_meta_box( 'submitdiv', 'page', 'side' );
			remove_meta_box( 'slugdiv', 'page', 'normal' );
			remove_meta_box( 'wpseo_meta', 'page', 'normal' );
			$metabox_position = 'side';

		} else {
			// Hide the post editor from view so the user can't make changes
			if ( apply_filters( 'totclc_hide_post_editor_css', false ) ) {
				echo '<style type="text/css">#postdivrich { display: none; }</style>';
			}
			$metabox_position = 'normal';
		}

		add_meta_box(
			'totclc_edit_notice',
			esc_html__( 'Homepage', 'totc-layout-control' ),
			array( $this, 'print_post_override_meta_box' ),
			null,
			$metabox_position,
			'high'
		);
		
		add_meta_box(
			'builder_explainer_notice',
			esc_html__( 'Content Editor', 'totc-layout-control' ),
			array( $this, 'print_post_explainer_meta_box' ),
			null,
			'normal',
			'high'
		);
	}

	/**
	 * Print a small manual meta box under the post title which includes a
	 * link to edit the post in the customizer.
	 *
	 * @since 0.9.2
	 */
	public function print_post_override_meta_box() {

		global $post;
		$control_title = $this->get_theme_support( 'control_title' );

		$args = array(
			'url' => get_permalink( $post ),
			'return' => get_edit_post_link( $post->ID, 'raw' ),
			'clc_onload_focus_control' => true,
		);
		$url = admin_url( 'customize.php' ) . '?' . http_build_query( $args );

		?>

			<p>
				<a class="button-primary" href="<?php echo esc_url( $url ); ?>">
					<?php echo $control_title; ?>
				</a>
			</p>
			<p class="description">
				<?php esc_html_e( 'Edit your page content using the Page Components panel in the Customizer.', 'totc-layout-control' ); ?>
			</p>

		<?php
	}
	
	public function print_post_explainer_meta_box() {
		$editor_button = $this->get_theme_support( 'control_title' );
		$builder_name = $this->get_theme_support( 'builder_name' );
	?>
		<p class="description">
			<?php esc_html_e( 'The content for this page which is set as the sites frontpage are handlled by the ' . $builder_name .'.', 'totc-layout-control' ); ?>
		</p>
		
		<p class="additional description">
			<?php esc_html_e( 'To start editing the content please click on the ' . $editor_button . ' button on the right sidebar.', 'totc-layout-control' ); ?>
		</p>
	<?php
	}

	/**
	 * Maybe move the Yoast SEO metabox so that the homepage editor metabox
	 * appears above it
	 *
	 * @since 0.9.2
	 */
	public function maybe_move_yoast_metabox( $priority ) {

		$admin_active_callback = $this->get_theme_support( 'admin_active_callback' );
		if ( !call_user_func( $admin_active_callback ) ) {
			return $priority;
		}

		$override = apply_filters( 'totclc_enable_post_editor_override', true );
		if ( !$override ) {
			return $priority;
		}

		return 'default';
	}
	
	/**
	 * Enqueue the assets required for the customizer control pane
	 *
	 * @since  0.1.0
	 */
	public function enqueue_control_assets() {
		$min = SCRIPT_DEBUG ? '' : 'min.';
		wp_enqueue_style( 
			'chb-customizer-control', 
			self::$plugin_url . '/assets/css/customizer-control.' . $min . 'css', 
			CHB_PLUS_VERSION 
		);
		wp_enqueue_script( 
			'chb-customizer-control-js', 
			self::$plugin_url . '/assets/js/customizer-control.' . $min . 'js', 
			[ 
				'customize-controls', 
				'content-layout-control-js'
			], 
			CHB_PLUS_VERSION,
			true 
		);
		
	}

	/**
	 * Enqueue the assets required for the customizer preview pane
	 *
	 * @since 0.1.0
	 */
	public function enqueue_preview_assets() {

		$min = SCRIPT_DEBUG ? '' : 'min.';
		wp_enqueue_style( 
			'chb-customizer-preview', 
			self::$plugin_url . '/assets/css/customizer-preview.' . $min . 'css', 
			CHB_PLUS_VERSION 
		);	
		
		wp_enqueue_script( 
			'chb-customizer-preview-js', self::$plugin_url . '/assets/js/customizer-preview.' . $min . 'js', 
			[ 
				'customize-preview', 
				'content-layout-preview-js' 
			], 
			CHB_PLUS_VERSION, 
			true 
		);

		$upload_dir = wp_upload_dir();
		wp_localize_script( 'chb-customizer-preview-js', 'classic_homepage_builder', array(
			'nonce'          => wp_create_nonce( 'chb-customizer-ajax' ),
			'upload_dir_url' => $upload_dir['baseurl'],
			'strings'        => array(
				'unknown_error' => __( 'An unknown error occurred. Please try again. If the problem continues, please refresh the page.', 'components' ),
			),
		) );

		// Enqueue assets from plugins when active
		if ( function_exists( 'rtb_enqueue_assets' ) ) {
			global $rtb_controller;
			$rtb_controller->register_assets();
			rtb_enqueue_assets();
		}

		if ( class_exists( 'bpfwpInit' ) ) {
			add_action( 'wp_footer', [ $this, 'load_bpfwp_map_handlers' ] );
		}
	}
	
	public function enqueue_frontend_assets() {
		$min = SCRIPT_DEBUG ? '' : 'min.';
		wp_enqueue_style( 
			'classic-homepage-components-frontend', 
			CHB_PLUS_ASSETS_URL . 'css/frontend.css', 
			[], 
			CHB_PLUS_VERSION
		);
	}
	
	public function add_editor_styles() {
		add_editor_style( 
			CHB_PLUS_ASSETS_URL . 'css/frontend.css'
		);
	}
	
	protected function add_actions() {
		//add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_scripts' ], 998 );
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_frontend_assets' ] );
		add_action( 'init', [ $this, 'add_editor_styles' ] );
		
		add_action( 'customize_controls_enqueue_scripts', [ $this, 'enqueue_control_assets' ] );
		add_action( 'customize_preview_init', [ $this, 'enqueue_preview_assets' ] );
	}
	
	/**
	 * Plugin constructor.
	 */
	private function __construct() {

		$this->add_actions();
	}
}

/**
 * This function returns one totclcInit instance everywhere
 * and can be used like a global, without needing to declare the global.
 *
 * Example: $totclc = totclcInit();
 */
function totclcInit() {
	return totclcInit::instance();
}
add_action( 'plugins_loaded', 'totclcInit' );