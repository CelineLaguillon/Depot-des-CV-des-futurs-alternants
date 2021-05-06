// slightly modified version of the official W3C HTML5 email regex:
// https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
const VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' +
  '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
  '(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$')

  var STRONG_PASWWORD_REGEX = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  
  
  exports.testAdresseMail = function(adresse) { 
    if(VALID_EMAIL_REGEX.test(adresse)) {
		return true;
	}
	return false;

  };
  
  exports.testAdresseMail = function(mdp) { 
    if(STRONG_PASWWORD_REGEX.test(mdp)) {
		return true;
	}
	return false;
  };