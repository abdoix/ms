<?php
/**
 * @framework       iResponse Framework 
 * @version         1.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            index.php	
 */

# core 
use IR\Core\Application as Application;

# exceptions
use IR\Exceptions\IRException as IRException;
use IR\Exceptions\Types\SystemException as SystemException;

# require the main configuration of the framework 
require_once '../config/init.conf.php';

# require autoload config
require_once VENDOR_PATH . DS . 'autoload.php';

# require the main fatal errors handler of the framework 
require_once '../config/errors.conf.php';

try
{
    # create a new application
    $application = new Application();
    
    # initialize the application
    $application->initialize(); 

    # register the application
    $application->register(); 

    # start the application
    $application->start();
} 
catch (Throwable $e) 
{
    # if the exception is not an IRException try to wrap it into a SystemException
    $e = (!$e instanceof IRException) ? new SystemException($e->getMessage(),500,$e) : $e; 
    
    # try to log and render the current exception 
    if($e->getCode() != 404 && $e->getCode() != 401 && $e->getCode() != 403)
    {
        $e->logError();
    }
    
    $e->render(); 
}