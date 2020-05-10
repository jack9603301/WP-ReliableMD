<?php

namespace WPReliableMD\Admin;

class Controller {

	protected $config_filename;

	public function __construct() {

		add_filter( 'replace_editor', array( $this, 'WPReliableMD_init' ), 10, 2 );

		//Javascript 文件
		//add_filter( 'admin_head', array( $this, 'WPReliableMD_Enqueue_Scripts' ), 2 );
		//CSS 文件
		//add_filter( 'admin_head', array( $this, 'WPReliableMD_Enqueue_Style' ), 2 );

		add_filter( 'admin_body_class', array( $this, 'WPReliableMD_admin_body_class' ) );
		$this->config_filename = WPReliableMD_PATH.'/config.json';
	}

	public function WPReliableMD_Enqueue_Scripts($post_id) {
		//定义脚本本地化数据
		$ReliableMDSetting = array(
			'api_root'        => esc_url_raw( rest_url() ),
			'nonce'           => wp_create_nonce( 'wp_rest' ),
			'js_root'         => WPReliableMD_URL . '/js/',
			//'js_dep_lib_root' => 'https://cdn.jsdelivr.net/npm/',
			'js_dep_lib_root' => WPReliableMD_URL. '/node_modules/',
			'config' => $this->WPReliableMD_Config_Api(),
			"post_id" => $post_id
		);
		wp_localize_script( 'ReliableMD', 'ReliableMD', $ReliableMDSetting );
		wp_localize_script( 'require-paths', 'ReliableMD', $ReliableMDSetting );
		
		wp_enqueue_script('post');
		wp_enqueue_script('postbox');
		wp_enqueue_script( 'require' );
		wp_enqueue_script( 'require-paths' );
		wp_enqueue_script('DateExt');
		wp_enqueue_script('CallBackManager');
		wp_enqueue_script('tags-box');


		$CallbackCustomScripts = array();
		$CallbackCustomScriptsVer = array();

		/*
		 * filter  : registerJavascriptsCallback($scripts,$vers)
		 * comment : Register the files that need to be loaded for JavaScript callbacks that have a callback manager dependency.
		 * params  :
		 *   - $scripts : Return the parameter. You need to load the list of JavaScript files that can access the callbackmanager object.
		 *   - $vers: Return the version number corresponding to the script file registration list returned by the first parameter. It must correspond!
		 */

		 $CallbackCustomScripts = apply_filters("registerJavascriptsCallback",$CallbackCustomScripts,$CallbackCustomScriptsVer);

		 if(is_array($CallbackCustomScripts)) {
			 foreach($CallbackCustomScripts as $key => $value) {
				 if(array_key_exists($key,$CallbackCustomScriptsVer)) {
					wp_enqueue_script($key, $value, array( 'CallBackManager' ), $CallbackCustomScriptsVer[$key], false );
				 } else {
					 wp_enqueue_script($key, $value, array( 'CallBackManager' ), NULL, false );
				 }
			 }
		 }

		 wp_enqueue_script( 'ReliableMD' );
		 //do_action('admin_enqueue_scripts');
	}

	public function WPReliableMD_Enqueue_Style() {
		wp_enqueue_style( 'normalize' );
		wp_enqueue_style( 'codemirror' );
		wp_enqueue_style( 'github' );
		wp_enqueue_style( 'tui-editor' );
		wp_enqueue_style( 'tui-editor-contents' );
		wp_enqueue_style( 'tui-color-picker' );
		wp_enqueue_style( 'tui-chart' );
		wp_enqueue_style( 'katex' );
		wp_enqueue_style( 'ReliableMD' );
		
	}

	public function WPReliableMD_admin_body_class($classes) {
		if ( current_theme_supports( 'editor-styles' ) && current_theme_supports( 'dark-editor-style' ) ) {
			$classes .= "reliablemd-editor-page is-fullscreen-mode is-dark-theme";
		} else {
			// Default to is-fullscreen-mode to avoid jumps in the UI.
			$classes .= "reliablemd-editor-page is-fullscreen-mode";
		}
		return $classes;
	}

	public function WPReliableMD_Page_Init($post) {
		global $post_type_object,$title, $post_type;
		$this->WPReliableMD_Enqueue_Scripts($post->ID);
		$this->WPReliableMD_Enqueue_Style();

		?>

		<div class="rmd-editor">
            <div id="editor-title" style="margin-top: 1em;">
                <h1>Input your text here</h1>
			</div>
			<div id="code-html">
				 <div id="editSection"></div>
				 <div id="right-metabox" class="metabox">
					 <div id="submit" class="postbox">
						 <button class="handlediv" type="button" aria-expanded="true">
							 <span class="screen-reader-text">
								 <?php echo(_e("switch: submit")) ?>
							 </span>
							 <span class="toggle-indicator" aria-hidden="true"></span>
						 </button>
						 <h2 class="hndle ui-sortable-handle">
							 <span><?php echo(_e("submit")); ?></span>
						 </h2>
						 <div class="inside">
							<?php post_submit_meta_box($post,array()); ?>
						</div>
					 </div>
					 <div id="format" class="postbox">
						 <button class="handlediv" type="button" aria-expanded="true">
							 <span class="screen-reader-text">
								 <?php echo(_e("switch: format")) ?>
							 </span>
							 <span class="toggle-indicator" aria-hidden="true"></span>
						 </button>
						 <h2 class="hndle ui-sortable-handle">
							 <span><?php echo(_e("format")); ?></span>
						 </h2>
						 <div class="inside">
							<?php post_format_meta_box($post,array());?>
						</div>
					</div>
					<div id="tags" class="postbox">
						 <button class="handlediv" type="button" aria-expanded="true">
							 <span class="screen-reader-text">
								 <?php echo(_e("switch: tags")) ?>
							 </span>
							 <span class="toggle-indicator" aria-hidden="true"></span>
						 </button>
						 <h2 class="hndle ui-sortable-handle">
							 <span><?php echo(_e("tags")); ?></span>
						 </h2>
						 <div class="inside">
							<?php post_tags_meta_box($post,array()); ?>
						</div>
					</div>
					<div id="categories" class="postbox">
						 <button class="handlediv" type="button" aria-expanded="true">
							 <span class="screen-reader-text">
								 <?php echo(_e("switch: categories")) ?>
							 </span>
							 <span class="toggle-indicator" aria-hidden="true"></span>
						 </button>
						 <h2 class="hndle ui-sortable-handle">
							 <span><?php echo(_e("categories")); ?></span>
						 </h2>
						 <div class="inside">
							<?php post_categories_meta_box($post,array()); ?>
						</div>
					</div>
				</div>
				<div id="bottom-metabox" class="metabox">
					<div id="postexcerpt" class="postbox">
						<button class="handlediv" type="button" aria-expanded="true">
							 <span class="screen-reader-text">
								 <?php echo(_e("switch: excerpt")) ?>
							 </span>
							 <span class="toggle-indicator" aria-hidden="true"></span>
						</button>
						<h2 class="hndle ui-sortable-handle">
							 <span><?php echo(_e("excerpt")); ?></span>
						</h2>
						<div class="inside">
							<?php post_excerpt_meta_box($post); ?>
						</div>
					</div>
					<div id="trackback" class="postbox">
						<button class="handlediv" type="button" aria-expanded="true">
							 <span class="screen-reader-text">
								 <?php echo(_e("switch: trackback")) ?>
							 </span>
							 <span class="toggle-indicator" aria-hidden="true"></span>
						</button>
						<h2 class="hndle ui-sortable-handle">
							 <span><?php echo(_e("trackback")); ?></span>
						</h2>
						<div class="inside">
							<?php post_trackback_meta_box($post); ?>
						</div>
					</div>
					<div id="custom" class="postbox">
						<button class="handlediv" type="button" aria-expanded="true">
							 <span class="screen-reader-text">
								 <?php echo(_e("switch: custom")) ?>
							 </span>
							 <span class="toggle-indicator" aria-hidden="true"></span>
						</button>
						<h2 class="hndle ui-sortable-handle">
							 <span><?php echo(_e("custom")); ?></span>
						</h2>
						<div class="inside">
							<?php post_custom_meta_box($post); ?>
						</div>
					</div>
					<?php do_action('add_meta_boxes',$post_type,$post);  ?>
				</div>
			</div>
		</div>
		<?php
		do_action('admin_enqueue_style');
	}

	public function WPReliableMD_init( $return, $post ) {
		global $title, $post_type;

		if ( true === $return && current_filter() === 'replace_editor' ) {
			return $return;
		}

		add_filter( 'screen_options_show_screen', '__return_true' );

		$post_type_object = get_post_type_object( $post_type );
		if ( ! empty( $post_type_object ) ) {
			$title = $post_type_object->labels->edit_item;
		}

		require_once ABSPATH . 'wp-admin/includes/meta-boxes.php';

		require_once ABSPATH . 'wp-admin/includes/revision.php';

		require_once ABSPATH . 'wp-admin/admin-header.php';

		register_and_do_post_meta_boxes($post);

		$this->WPReliableMD_Page_Init($post);   //初始化页面

		$return = true;

		return $return;
	}

	public function WPReliableMD_Config_Api() {
		if ( file_exists( $this->config_filename ) ) {
			$f = fopen($this->config_filename, "r");
			$config = fread($f, filesize($this->config_filename));
			return json_decode($config,TRUE);
		} else {
			return [
				'enable' => true,
				'latex' => "MathJax",
				'info' => 'default config'
			];
		}
	}
}

?>
