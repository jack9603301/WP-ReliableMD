<?php

namespace WPReliableMD\View;

use WPReliableMD\View\Parser as Parser;

class Controller {

	public function __construct() {
		//Javascript 文件
		//add_filter( 'wp_head', array( $this, 'WPReliableMD_Enqueue_Scripts' ), 2 );
		//CSS
		//add_filter( 'wp_head', array( $this, 'WPReliableMD_Enqueue_Style' ), 2 );
		//markdown解析
		add_filter( 'the_content', array( $this, 'WPReliableMD_the_Content' ) );
		add_filter( 'the_excerpt', array( $this, 'WPReliableMD_the_excerpt' ) );
		add_filter('markdown_backend_rendered',array($this,'WPReliableMD_BackendRendered'),1,4);
		add_filter('markdown_text',array($this,'WPReliableMD_MarkdownText_Transference'),1,3);
		add_filter('markdown_shortcode_text',array($this,'WPReliableMD_MarkdownShortcodeText_AntiTransfer'),1);
		add_filter('widget_text', 'do_shortcode');
		add_filter('markdown_the_excerpt',array($this,'WPReliableMD_Encode_Process'),1,2);
		add_filter('auto_markdown_excerpt_process',array($this,'WPReliableMD_Encode_Process_Utf8'),1,3);
		add_filter('auto_markdown_excerpt_process',array($this,'WPReliableMD_Encode_Process_Gb2312'),1,3);

		add_shortcode('markdown',array($this,'WPReliableMD_Shortcode_Markdown'));

	}

	public function WPReliableMD_Encode_Process($string,$is_auto_get_excerpt)
	{
		$code = get_bloginfo('charset');
		$sublen = apply_filters('excerpt_length',50);
		if($is_auto_get_excerpt) {
			/*
			 * filter  : auto_markdown_excerpt_process($string,$sublen,$code)
			 * comment : Extended coding support function covering markdown automatic interception summary mechanism.
			 * params  :
			 *   - $string : Pre processing string.
			 *   - $sublen : Processing string length.
			 *   - $code : Encoding of processing data.
			 */
			$string = apply_filters('auto_markdown_excerpt_process',$string,$sublen,$code);
		} else {
			/*
			 * filter  : markdown_excerpt_process($string,$sublen,$code)
			 * comment : Extended coding support function covering markdown automatic interception summary mechanism.
			 * params  :
			 *   - $string : Pre processing string.
			 *   - $code : Encoding of processing data.
			 */
			$string = apply_filters('markdown_excerpt_process',$string,$code);
		}
		return $string;
	}

	public function WPReliableMD_Encode_Process_Utf8($string,$sublen,$code) {
		$start = 0;
		if($code == "UTF-8") {
			//UTF-8处理
			$pa = "/[\x01-\x7f]|[\xc2-\xdf][\x80-\xbf]|\xe0[\xa0-\xbf][\x80-\xbf]|[\xe1-\xef][\x80-\xbf][\x80-\xbf]|\xf0[\x90-\xbf][\x80-\xbf][\x80-\xbf]|[\xf1-\xf7][\x80-\xbf][\x80-\xbf][\x80-\xbf]/";
			preg_match_all($pa, $string, $t_string);

			$string = join('', array_slice($t_string[0], $start, $sublen));
		}

		return $string;
	}

	public function WPReliableMD_Encode_Process_Gb2312($string,$sublen,$code) {
		$start = 0;
		if($code == "GB2312") {
			//GB2312
			$start = $start*2;
			$sublen = $sublen*2;
			$strlen = strlen($string);
			$tmpstr = '';

			for($i=0; $i< $strlen; $i++)
			{
				if($i>=$start && $i< ($start+$sublen))
				{
					if(ord(substr($string, $i, 1))>129)
					{
						$tmpstr.= substr($string, $i, 2);
					}
					else
					{
						$tmpstr.= substr($string, $i, 1);
					}
				}
				if(ord(substr($string, $i, 1))>129) {
					$i++;
				}
			}
			$string = $tmpstr;
		}
		return $string;
	}

	public function WPReliableMD_the_excerpt( $post_excerpt ) {
		$post_id = get_the_ID();
		$post = get_post( $post_id );
		if ( ! has_excerpt() ) {
			$post_excerpt = $post->post_content;
		}

		if ( get_post_meta( $post_id, 'markdown', true ) === 'true' ) {
			/*
			 * filter  : markdown_backend_rendered($backend_rendered,$content,$excerpt_bool)
			 * comment : The original markdown data is preprocessed by the back end, and the rendering result is returned.
			 * params  :
			 *   - $backend_rendered : The output of a summary or the back end of an article.
			 *   - $content : Subject before treatment
			 *   - $excerpt_bool : If it is an article, it is false, if it is a summary, then it is true.
			 *   - $is_shortcode_tag : If the short tag parser is parsed, it is true, otherwise it is false.
			 */
			$post_excerpt = apply_filters('markdown_backend_rendered',$post_excerpt,$post->post_content,true,false);
			if ( preg_match( '#<p>((\w|\d|[^x00-xff]).+?)</p>#', $post_excerpt, $mc ) ) {
				$post_excerpt = $mc[1];
				/*
			 	 * filter  : markdown_the_excerpt($post_excerpt)
			 	 * comment : This filter Hook process extracts the summary processing when extracting the abstract.
			 	 * params  :
			 	 *   - $post_excerpt : Subject before treatment
			 	 *   - $is_auto_get_excerpt : Do you extract abstract text?
			 	 */
				$post_excerpt = apply_filters('markdown_the_excerpt',$post_excerpt,true);
			} else {
				$post_excerpt = __('This post has no common text');
				/*
			 	 * filter  : markdown_the_excerpt_no_text_extract($post_excerpt)
			 	 * comment : This filter Hook processing does not extract the summary processing when extracting the abstract.
			 	 * params  :
			 	 *   - $post_excerpt : Subject before treatment
			 	 *   - $is_auto_get_excerpt : Do you extract abstract text?
			 	 */
				$post_excerpt = apply_filters('markdown_the_excerpt',$post_excerpt,false);
			}
		}

		return do_shortcode($post_excerpt);
	}

	public function WPReliableMD_Enqueue_Scripts() {
		global $ReliableMDAdminController;
		if(is_null($ReliableMDAdminController)) {
			$ReliableMDSetting = array(
				'api_root'        => esc_url_raw( rest_url() ),
				'nonce'           => wp_create_nonce( 'wp_rest' ),
				'js_root'         => WPReliableMD_URL . '/js/',
				'js_dep_lib_root' => 'https://cdn.jsdelivr.net/npm/',
				'id'              => get_the_ID(),
				'config'          => false
			);
		} else {
			$ReliableMDSetting = array(
				'api_root'        => esc_url_raw( rest_url() ),
				'nonce'           => wp_create_nonce( 'wp_rest' ),
				'js_root'         => WPReliableMD_URL . '/js/',
				'js_dep_lib_root' => 'https://cdn.jsdelivr.net/npm/',
				'id'              => get_the_ID(),
				'config'          => $ReliableMDAdminController->WPReliableMD_Config_Api()
			);
		}

		wp_localize_script( 'WPReliableMDFrontend', 'ReliableMD', $ReliableMDSetting );
        wp_localize_script( 'require-paths', 'ReliableMD', $ReliableMDSetting );
        wp_enqueue_script( 'latexjs' );
        wp_enqueue_script( 'tui-editor' );
        wp_enqueue_script( 'tui-chart' );
        wp_enqueue_script( 'tui-chart-plugin' );
        wp_enqueue_script( 'tui-code-syntax-highlight' );
        wp_enqueue_script( 'tui-color-picker' );
        wp_enqueue_script( 'tui-color-syntax' );
        wp_enqueue_script( 'tui-table-merged-cell' );
        wp_enqueue_script( 'tui-uml' );
        wp_enqueue_script( 'require' );
        wp_enqueue_script( 'require-paths' );
        wp_enqueue_script( 'WPReliableMDFrontend' );
	}

	public function WPReliableMD_Enqueue_Style() {
		wp_enqueue_style( 'normalize' );
		wp_enqueue_style( 'codemirror' );
		wp_enqueue_style( 'github' );
		wp_enqueue_style( 'latexjs-base' );
		wp_enqueue_style( 'latexjs-article' );
		wp_enqueue_style( 'latexjs-book' );
		wp_enqueue_style( 'latexjs-katex' );
		wp_enqueue_style( 'tui-editor' );
		wp_enqueue_style( 'tui-chart' );
		wp_enqueue_style( 'tui-prism' );
		wp_enqueue_style( 'tui-code-syntax-highlight' );
		wp_enqueue_style( 'tui-color-picker' );
		wp_enqueue_style( 'tui-color-syntax' );
		wp_enqueue_style( 'tui-table-merged-cell' );
		wp_enqueue_style( 'WPReliableMDFrontend' );
	}

	public function WPReliableMD_the_Content( $content ) {
		if ( get_post_meta( get_the_ID(), 'markdown', true ) === 'true' ) {
			//如果是markdown文章，则输出，不使用前面处理的结果，直接取文章数据
			$post    = get_post( get_the_ID() );
			$content = $post->post_content;
			$content = $this->WPReliableMD_Content( $content );
		}

		return do_shortcode($content);
	}

	public function WPReliableMD_Shortcode_Markdown( $attr, $content ) {
		/*
		 * filter  : markdown_shortcode_text($markdown)
		 * comment : Markdown text for short code parser.
		 * params  :
		 *   - $markdown : Markdown text before input processing.
		 */
		$content = apply_filters('markdown_shortcode_text',$content);
		return do_shortcode($this->WPReliableMD_Content($content,true));  //解析，执行
	}

	public function WPReliableMD_MarkdownShortcodeText_AntiTransfer($markdown)  {
		$AntiTransfer = array(
			'&gt;' => '>',
			'&lt;' => '<',
		);

		/*
		 * filter  : markdown_antiTransfer($AntiTransfer)
		 * comment : Filter Hook for handling inverted tables.
		 * params  :
		 *   - $AntiTransfer : Input inverted meaning table and output inversion table.
		 */
		$AntiTransfer = apply_filters('markdown_antiTransfer',$AntiTransfer);


		foreach ($AntiTransfer as $key => $value) {
			$markdown = str_replace($key,$value,$markdown);
		}
		return $markdown;
	}

	public function WPReliableMD_Content( $content,$is_shortcode_tag = false ) {

		$this->WPReliableMD_Enqueue_Scripts();
		$this->WPReliableMD_Enqueue_Style();

		$backend_rendered = null;

		$backend_rendered_text = $content;

		/*
		* filter  : markdown_text($markdown)
		* comment : The original content of markdown is processed and then processed.
		* params  :
		*   - $markdown : Subject before treatment
		*   - $is_backend_rendered : If the result is input to the pre renderer, it is true, otherwise it is false.
		*   - $is_shortcode_tag : If the short tag parser is parsed, it is true, otherwise it is false.
		*/

		$backend_rendered_text = apply_filters('markdown_text',$backend_rendered_text,true,$is_shortcode_tag);  //执行HOOK，进行处理

		/*
		* filter  : markdown_backend_rendered($backend_rendered,$content,$excerpt_bool)
		* comment : The original markdown data is preprocessed by the back end, and the rendering result is returned.
		* params  :
		*   - $backend_rendered : The output of a summary or the back end of an article.
		*   - $content : Subject before treatment
		*   - $excerpt_bool : If it is an article, it is false, if it is a summary, then it is true.
		*   - $is_shortcode_tag : If the short tag parser is parsed, it is true, otherwise it is false.
		*/
		$backend_rendered = apply_filters('markdown_backend_rendered',$backend_rendered,$backend_rendered_text,false,$is_shortcode_tag);  //可由用户覆盖解析效果

		/*
		* filter  : markdown_text($markdown)
		* comment : The original content of markdown is processed and then processed.
		* params  :
		*   - $markdown : Subject before treatment
		*   - $is_backend_rendered : If the result is input to the pre renderer, it is true, otherwise it is false.
		*   - $is_shortcode_tag : If the short tag parser is parsed, it is true, otherwise it is false.
		*/

		$content = apply_filters('markdown_text',$content,false,$is_shortcode_tag);  //执行HOOK，进行处理

		$new_content      = "<div class='markdown-block'>";
		$new_content      .= "<pre class='markdown' style='display:none;'>{$content}</pre>";
		$new_content      .= "<div class='markdown-backend-rendered'>{$backend_rendered}</div>";
		$new_content      .= "</div>";

		if(!$is_shortcode_tag) {
			$content = "<div class='posts'>{$new_content}</div>";
		} else {
			$md_hash = hash('md5',$backend_rendered_text);
			$content = "<div class='shortcode' hash='{$md_hash}'>{$new_content}</div>";
		}

		/*
		* filter  : markdown_content($content)
		* comment : The results returned by the markdown server are processed, and then returned to the browser.
		* params  :
		*   - $content : Subject before treatment
		*   - $is_backend_rendered : If the result is input to the pre renderer, it is true, otherwise it is false.
		*   - $is_shortcode_tag : If the short tag parser is parsed, it is true, otherwise it is false.
		*/

		$content = apply_filters('markdown_content',$content,false,$is_shortcode_tag);  //执行HOOK，进行处理

		return $content;
	}

	public function WPReliableMD_MarkdownText_Transference($markdown,$is_backend_rendered,$is_shortcode_tag) {
		//转义处理

		if(!$is_backend_rendered) {
			$markdown = str_replace(array("\r\n", "\r", "\n"),'&br;',$markdown);
			$markdown = str_replace(array("<"),'&lt;',$markdown);
			$markdown = str_replace(array(">"),'&gt;',$markdown);
			$markdown = str_replace(array("\""),'&quot;',$markdown);
		}


		return $markdown;
	}

	public function WPReliableMD_BackendRendered($backend_rendered,$content,$excerpt_bool,$is_shortcode_tag) {
		if(!$is_shortcode_tag) {
			$post_id = get_the_ID();
			if($excerpt_bool) {
				//如果是摘要缓存
				$backend_rendered = wp_cache_get($post_id,'markdown_backend_rendered:excerpt');
				if($backend_rendered === false) {
					$parser = new Parser();
					$backend_rendered = $parser->makeHtml( $content );
					wp_cache_set($post_id,$backend_rendered,'markdown_backend_rendered:excerpt');
				}
			} else {
				//如果是文章缓存
				$backend_rendered = wp_cache_get($post_id,'markdown_backend_rendered');
				if($backend_rendered === false) {
					$parser = new Parser();
					$backend_rendered = $parser->makeHtml( $content );
					wp_cache_set($post_id,$backend_rendered,'markdown_backend_rendered');
				}
			}
		} else {
			//短标签渲染器
			$md_hash = hash('md5',$content);
			$backend_rendered = wp_cache_get($md_hash,'markdown_backend_rendered:shortcode');
			if($backend_rendered === false) {
				$parser = new Parser();
				$backend_rendered = $parser->makeHtml( $content );
				wp_cache_set($md_hash,$backend_rendered,'markdown_backend_rendered:shortcode');
			}

		}


		return $backend_rendered;
	}
}

?>
