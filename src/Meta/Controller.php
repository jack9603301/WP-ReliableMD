<?php

namespace WPReliableMD\Meta;

class Controller {

	public function __construct() {
		add_filter( 'plugin_action_links_' . WPReliableMD_NAME, array( $this, 'MetaActionLinks' ), 10, 5 );
		add_filter( 'plugin_row_meta', array( $this, 'MetaRowMetaLinks' ), 10, 2 );
	}

	public function MetaActionLinks($actions) {
		return array_merge(
			array(
				'<a href="' . admin_url( "plugins.php?page=WP-ReliableMD-Settings" ) . '" rel="nofollow">' . __( 'Settings', WPReliableMD_NAME ) . '</a>',
				'<a href="https://github.com/jackworkshop/WP-ReliableMD.git" target="_blank" rel="nofollow">' . __( 'Github', WPReliableMD_NAME ) . '</a>'
			),
			$actions
		);
	}

	public function MetaRowMetaLinks($links, $file) {
		if ( strpos( $file, WPReliableMD_FILE ) !== false ) {
			$new_links = array(
				"Issues" => '<a href="https://github.com/jackworkshop/WP-ReliableMD/issues" target="_blank" rel="nofollow">' . __( 'Issues', WPReliableMD_NAME ) . '</a>',
				'Github' => '<a href="https://github.com/jackworkshop/WP-ReliableMD.git" target="_blank" rel="nofollow">' . __( 'Github', WPReliableMD_NAME ) . '</a>',
				'Gitlab' => '<a href="https://gitlab.com/jackworkshop/WP-ReliableMD.git" target="_blank" rel="nofollow">' . __( 'Gitlab', WPReliableMD_NAME ) . '</a>',
				'Gitee' => '<a href="https://gitee.com/jackworkshop/WP-ReliableMD.git" target="_blank" rel="nofollow">' . __( 'Gitee', WPReliableMD_NAME ) . '</a>',
			);
			$links = array_merge( $links, $new_links );
		}
		return $links;
	}
}

?>
