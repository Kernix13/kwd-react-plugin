<?php

/*
  Plugin Name:  KWD React Plugin One
  Plugin URI:   https://github.com/Kernix13
  Description:  Multiple choice quiz
  Version:      1.0.0
  Author:       James Kernicky
  Author URI:   https://kernixwebdesign.com/
  License:      GPLv2 or later
  License URI:  https://www.gnu.org/licenses/gpl-2.0.html
  Text Domain:  some-name-here
*/

if( ! defined('ABSPATH') ) exit; // Exit if accessed directly

class KWDReactPluginOne {
  function __construct() {
    add_action( 'init', array($this, 'adminAssets') );
  }

  function adminAssets() {
    register_block_type(__DIR__, array(
      'render_callback' => array($this, 'theHTML')
    ));
  }

  function theHTML($attributes) { 
    ob_start(); ?>
    <div class="paying-attention-update-me"><pre style="display: none;"><?php echo wp_json_encode($attributes) ?></pre></div>
    <?php return ob_get_clean();
  }
}

$kwdReactPluginOne = new KWDReactPluginOne();