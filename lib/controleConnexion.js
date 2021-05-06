// slightly modified version of the official W3C HTML5 email regex:
// https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
const VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' +
  '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
  '(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$')

const STRONG_PASSWORD_REGEX = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\-!@#\$%\^&\*])(?=.{4,})");
  // changer le 4 final en 8

const VALID_TELEPHONE_REGEX = new RegExp("^[0-9]{10}$");


  exports.testAdresseMail = function(adresse) { 
    if (VALID_EMAIL_REGEX.test(adresse)) 
		return true;	
	return false;
  }
  
  exports.testMotDePasse = function(mdp) { 
    if(STRONG_PASSWORD_REGEX.test(mdp)) 
		return true;
	return false;
  }

  exports.testConfirmationMotDePasse = function(mdp, mdp_conf) { 
    if (mdp === mdp_conf) 
		return true;  
    return false;
  }

  