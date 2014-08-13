define([],function(){return{

	//
	// define your error messages here
	//
	// this file will be used by the Error class
	//
	
	en : {
		error : {
			success : "SUCCESS.",
			firstname : {
				required : "First name is required.",
				minLength : "First name must be at least 2 characters long.",
				maxLength : "First name must not be more than 255 characters long."
			},
			lastname  : {
				required : "Last name is required.",
				minLength : "Last name must be at least 2 characters long.",
				maxLength : "Last name must not be more than 255 characters long."
			},
			email     : {
				required : "Email address is required.",
				email    : "Email address is invalid."
			},
			mobile : {
				required : "Mobile number is required.",
				phone    : "Mobile number is invalid."
			},
			iagree : {
				required : "You must agree to the Terms & Conditions."
			},
			system : {
				error : "System error. Please try again.",
				missingRequired : "Missing required information."
			}
		}
	},

	fr : {
		error : {
			success : "SUCCESS.",
			firstname : {
				required : "Le prénom est nécessaire.",
				minLength : "Le prénom n'est pas valide.",
				maxLength : "Le preénom n'est pas valide."
			},
			lastname  : {
				required : "Nom de famille est nécessaire.",
				minLength : "Nom de famille n'est pas valide.",
				maxLength : "Nom de famille n'est pas valide."
			},
			email     : {
				required : "Address e-mail est nécessaire.",
				email    : "Address e-mail n'est pas valide."
			},
			mobile : {
				required : "Numéro de téléphone mobile est nécessaire.",
				phone    : "Numéro de téléphone mobile n'est pas valide."
			},
			iagree : {
				required : "Vous devez accepter les Conditions Générales de Vente."
			},
			system : {
				error : "Erreur système. Veuillez réessayer.",
				missingRequired : "Information requise manquante."
			}
		}
	}

};});