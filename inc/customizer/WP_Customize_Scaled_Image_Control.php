<?php
if ( !class_exists( 'Components_WP_Customize_Scaled_Image_Control' ) ) {
	/**
	 * Customize Scaled Image Control class.
	 *
	 * This extends the Media Control to add an input to control the scale of
	 * the image. In place of a single setting, it accepts an array consisting
	 * of exactly two setting ids. The first should point to the image setting,
	 * the second to the scale setting.
	 *
	 * @see WP_Customize_Media_Control
	 * @see WP_Customize_Control
	 * @since 1.0.0
	 */
	class Components_WP_Customize_Scaled_Image_Control extends WP_Customize_Media_Control {
		/**
		 * Control type
		 *
		 * @since 1.0.0
		 */
		public $type = 'scaled_image';

		/**
		 * Setting id for the scale
		 *
		 * @since 1.0.0
		 */
		public $scale = '';

		/**
		 * Default value for the scale
		 *
		 * @since 1.0.0
		 */
		public $scale_default = '';

		/**
		 * Minimum allowed scale value
		 *
		 * @since 1.0.0
		 */
		public $min = 0;

		/**
		 * Maximum allowed scale value
		 *
		 * @since 1.0.0
		 */
		public $max = 100;

		/**
		 * Constructor.
		 *
		 * @see WP_Customize_Media_Control::__construct()
		 * @param WP_Customize_Manager $manager Customizer bootstrap instance.
		 * @param string               $id      Control ID.
		 * @param array                $args    Optional. Arguments to override class property defaults.
		 * @since 1.0.0
		 */
		public function __construct( $manager, $id, $args = array() ) {

			parent::__construct( $manager, $id, $args );

			// WP_Customize_Media_Control expects to find the image setting in
			// $settings['default'] and also expects to find it at
			// $this->setting.
			reset( $this->settings );
			$this->setting = current( $this->settings );
			$this->settings['default'] = $this->setting;

			// Store the setting id and default value for the scale setting
			next( $this->settings );
			$this->scale = key( $this->settings );
			$setting = current( $this->settings );
			if ( is_object( $setting ) ) {
				$this->scale_default = $setting->default;
			}
		}

		/**
		 * Render a JS template for the content of the media control.
		 *
		 * This adds a range input below the media control.
		 *
		 * @since 1.0.0
		 */
		public function content_template() {
			parent::content_template();
			?>

			<div class="scale<# if ( data.attachment && data.attachment.id ) { #> is-visible<# } #>">
				<div class="description">
					<?php esc_html_e( 'Scale', 'components' ); ?>
				</div>
				<input type="range" value="{{ data.scale_value }}" data-customize-setting-link="{{ data.scale_setting }}" min="{{ data.min }}" max="{{ data.max }}" >
			</div>

			<?php
		}

		/**
		 * Refresh the parameters passed to the JavaScript via JSON.
		 *
		 *
		 * @see WP_Customize_Media_Control::to_json()
		 * @since 1.0.0
		 */
		public function to_json() {
			parent::to_json();

			$this->json['scale_value'] = $this->value( $this->scale );
			$this->json['scale_setting'] = $this->scale;
			$this->json['scale_default'] = $this->scale_default;
			$this->json['min'] = $this->min;
			$this->json['max'] = $this->max;
		}
	}
}
