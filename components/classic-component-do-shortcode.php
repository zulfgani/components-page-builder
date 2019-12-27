<?php defined( 'ABSPATH' ) || exit;
if ( !class_exists( 'Classic_Component_Do_Shortcode' ) ) {
/**
 * Map component
 *
 * @since 0.1
 */
class Classic_Component_Do_Shortcode extends CLC_Component {

	/**
	 * Type of component
	 *
	 * @param string
	 * @since 0.1
	 */
	public $type = 'classic-component-do-shortcode';
	
	/**
	 * Contact Form ID
	 *
	 * @param int
	 * @since 0.1
	 */
	public $shortcode = '';
	
	public $title = '';
	
	public $selector_id = '';

	/**
	 * Settings expected by this component
	 *
	 * @param array Setting keys
	 * @since 0.1
	 */
	public $settings = [ 'title', 'shortcode', 'selector_id' ];

	/**
	 * Sanitize settings
	 *
	 * @param array val Values to be sanitized
	 * @return array
	 * @since 0.1
	 */
	public function sanitize( $val ) {

		return [
			'title'          => isset( $val['title'] ) ? sanitize_text_field( $val['title'] ) : '',
			'shortcode'      => isset( $val['shortcode'] ) ? sanitize_text_field( $val['shortcode'] ) : '',
			'selector_id'    => isset( $val['selector_id'] ) ? sanitize_text_field( $val['selector_id'] ) : $this->selector_id,
			'type'           => $this->type, // Don't allow this to be modified
		];
	}
	
	public function render_layout() {
		global $post;
		echo '<div id="' . esc_attr( $this->selector_id ) . '" class="clc-wrapper clc-do-shortcode">';
			echo '<h2 class="title">' . esc_html( $this->title ). '</h2>';
			echo "'" . $this->shortcode . "'";			
		echo '</div>';
	}

	/** /components/templates/
	 * Print the control template. It should be an Underscore.js template
	 * using the same template conventions as core ClassicPress controls
	 *
	 * @since 0.1
	 */
	public function control_template() {
		?>
		<div class="header">
			<h4 class="name">
				<?php esc_html_e( $this->name ); ?>
				<span class="title">{{ data.model.get( 'title' ) }}</span>
			</h4>
			<a href="#" class="clc-toggle-component-form"><?php esc_html_e( CLC_Content_Layout_Control::$i18n['control-toggle'] ); ?></a>
		</div>
		<div class="control">
		
			<label>
				<span class="customize-control-title"><?php echo $this->i18n['title']; ?></span>
				<input type="text" value="{{ data.model.get( 'title' ) }}" data-clc-setting-link="title">
			</label>
			
			<label>
				<span class="customize-control-title"><?php echo $this->i18n['shortcode_label']; ?></span>
				<input type="text" value="{{ data.model.get( 'shortcode' ) }}" data-clc-setting-link="shortcode">
			</label>
			
		</div>
		<div class="footer">
			<a href="#" class="delete"><?php esc_html_e( CLC_Content_Layout_Control::$i18n['delete'] ); ?></a>
		</div>
		<?php
	}
}

}