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

	public function WPReliableMD_Enqueue_Scripts() {
		wp_enqueue_script( 'require' );
		wp_enqueue_script( 'require-paths' );
		wp_enqueue_script( 'ReliableMD' );
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

	public function WPReliableMD_Page_Init() {
		global $post_type_object;
		$this->WPReliableMD_Enqueue_Scripts();
		$this->WPReliableMD_Enqueue_Style();

		?>

        <div id="editor-title" style="margin-top: 1em;">
            <h1>Input your text here</h1>
        </div>

        <div class="code-html">
            <div id="editSection"></div>
            <div style="text-align: right">
                <button id="submit">Submit</button>
            </div>
        </div>
		<?php
	}

	public function WPReliableMD_init( $return, $post ) {
		global $title, $post_type;

		if ( true === $return && current_filter() === 'replace_editor' ) {
			return $return;
		}

		add_filter( 'screen_options_show_screen', '__return_false' );

		$post_type_object = get_post_type_object( $post_type );
		if ( ! empty( $post_type_object ) ) {
			$title = $post_type_object->labels->edit_item;
		}

		require_once ABSPATH . 'wp-admin/includes/meta-boxes.php';

		require_once ABSPATH . 'wp-admin/includes/revision.php';

		require_once ABSPATH . 'wp-admin/admin-header.php';

		$this->WPReliableMD_Page_Init();   //初始化页面

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
