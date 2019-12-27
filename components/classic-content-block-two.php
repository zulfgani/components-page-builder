<?php if ( ! defined( 'ABSPATH' ) ) exit;
if ( !class_exists( 'Classic_CLC_Component_Content_Block_Two' ) ) {
	include_once( CLC_Content_Layout_Control::$dir . '/components/content-block-two.php' );
	/**
	 * Single-block title/photo/text layout component
	 *
	 * @since 1.0.0
	 */
	class Classic_CLC_Component_Content_Block_Two extends CLC_Component_Content_Block {

		/**
		 * Type of component
		 *
		 * @param string
		 * @since 1.0.0
		 */
		public $type = 'classic-content-block-two';

		/**
		 * A title string that appers above the primary title
		 *
		 * @param string
		 * @since 1.0.0
		 */
		public $title_line_one = '';
		
		public $selector_id = '';

		/**
		 * Settings expected by this component
		 *
		 * @param array Setting keys
		 * @since 1.0.0
		 */
		public $settings = array( 
			'title_line_one', 
			'content', 
			'links', 
			'image', 
			'image_position', 
			'selector_id' 
		);

		/**
		 * Initialize
		 *
		 * @since 1.0.0
		 */
		public function __construct( $args ) {
			parent::__construct( $args );
		}

		/**
		 * Sanitize settings
		 *
		 * @param array val Values to be sanitized
		 * @return array
		 * @since 1.0.0
		 */
		public function sanitize( $val ) {

			$new_val = parent::sanitize( $val );
			$new_val['title_line_one'] = isset( $val['title_line_one'] ) ? sanitize_text_field( $val['title_line_one'] ) : $this->title_line_one;
			$new_val['selector_id'] = isset( $val['selector_id'] ) ? sanitize_text_field( $val['selector_id'] ) : $this->selector_id;

			return $new_val;
		}

		/**
		 * Render the layout template and return an HTML blob with the content,
		 * ready to be appended or saved to `post_content`
		 *
		 * @since 1.0.0
		 */
		public function render_layout() {
			?>
			
			<div id="<?php echo esc_attr( $this->selector_id ); ?>" class="clc-wrapper<?php if ( $this->image ) { ?> image-position-<?php echo esc_attr( $this->image_position ); } ?>">
				
				<h2 class="content-block-two-header">
					<span class="title_line_one"><?php echo $this->title_line_one; ?></span>
				</h2>
				<div class="content-block-two-container">
				<?php if ( $this->image ) { ?>
					<div class="image">
						<?php echo wp_get_attachment_image( $this->image, 'medium' ); ?>
					</div>
				<?php } ?>	
					
				<div class="text">
					<div class="content">
						<?php echo $this->content; ?>
					</div>
					<?php if ( !empty( $this->links ) ) { ?>
						<ul class="links">
							<?php foreach( $this->links as $link ) : ?>
								<li>
									<a href="<?php echo esc_url( $link['url'] ); ?>"><?php echo esc_html( $link['link_text'] ); ?></a>
								</li>
							<?php endforeach; ?>
						</ul>
					<?php } ?>
				</div>
				</div>
			</div>
			<?php
		}

		/**
		 * Print the control template. It should be an Underscore.js template
		 * using the same template conventions as core ClassicPress controls
		 *
		 * @since 1.0.0
		 */
		public function control_template() {
			?>
			<div class="header">
				<h4 class="name">
					<?php echo esc_html( $this->name ); ?>
					<span class="title">{{ data.model.get( 'title_line_one' ) }}</span>
				</h4>
				<a href="#" class="clc-toggle-component-form"><?php echo esc_html( CLC_Content_Layout_Control::$i18n['control-toggle'] ); ?></a>
			</div>

			<div class="control">

				<label>
					<span class="customize-control-title"><?php echo $this->i18n['title_line_one']; ?></span>
					<input type="text" value="{{ data.model.get( 'title_line_one' ) }}" data-clc-setting-link="title_line_one">
				</label>
				
				<label>
					<span class="customize-control-title"><?php echo $this->i18n['content']; ?></span>
					<textarea data-clc-setting-link="content">{{ data.model.get( 'content' ) }}</textarea>
				</label>
				
				<div class="setting link-panel-control">
				
					<span class="customize-control-title"><?php echo $this->i18n['links']; ?></span>
					
					<# if ( data.model.get( 'links' ).length ) { #>
						<ul class="link-panel-control-links">
							<# for ( var i in data.model.get( 'links' ) ) { #>
								<li>
									<a href="{{ data.model.get( 'links' )[i].url }}" class="link">
										{{ data.model.get( 'links' )[i].link_text }}
									</a>
									<#/* Need to add an edit link/buton here! */#>
									<a href="#" class="remove-link" data-index="{{ i }}">
										<?php echo $this->i18n['links_remove_button']; ?>
									</a>
								</li>
							<# } #>
						</ul>
					<# } #>
					
					<div class="buttons">
						<button class="add-link button-primary">
							<?php echo $this->i18n['links_add_button']; ?>
						</button>
					</div>
					
				</div>
				
				<div class="setting">
				
					<span class="customize-control-title"><?php echo $this->i18n['image']; ?></span>
					
					<# if ( !data.model.get( 'image' ) ) { #>
						<div class="placeholder">
							<?php echo $this->i18n['image_placeholder']; ?>
						</div>
					<# } else { #>
						<div class="thumb loading"></div>
						<fieldset class="position checkbox-list">
							<legend>
								<?php echo $this->i18n['image_position']; ?>
							</legend>
							<label>
								<input type="radio" name="image_position_{{ data.model.get( 'id' ) }}" value="left"<# if ( data.model.get( 'image_position' ) == 'left' ) { #> checked<# } #>>
								<?php echo $this->i18n['image_position_left']; ?>
							</label>
							<label>
								<input type="radio" name="image_position_{{ data.model.get( 'id' ) }}" value="right"<# if ( data.model.get( 'image_position' ) == 'right' ) { #> checked<# } #>>
								<?php echo $this->i18n['image_position_right']; ?>
							</label>
						</fieldset>
					<# } #>
					
					<div class="buttons">
						<# if ( !data.model.get( 'image' ) ) { #>
							<button class="select-image button-primary">
								<?php echo $this->i18n['image_select_button']; ?>
							</button>
						<# } else { #>
							<button class="select-image button-primary">
								<?php echo $this->i18n['image_change_button']; ?>
							</button>
							<button class="remove-image button-secondary">
								<?php echo $this->i18n['image_remove_button']; ?>
							</button>
						<# } #>
					</div>
					
				</div>
				<label>
					<span class="customize-control-title"><?php echo $this->i18n['selector_id']; ?></span>
					<input type="text" value="{{ data.model.get( 'selector_id' ) }}" data-clc-setting-link="selector_id">
				</label>
				
				
			</div>

			<div class="footer">
				<a href="#" class="delete"><?php echo esc_html( CLC_Content_Layout_Control::$i18n['delete'] ); ?></a>
			</div>
			<?php
		}
	}
}
