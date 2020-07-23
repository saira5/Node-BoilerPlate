const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const _ = require('lodash');


/**tag
*  Validations
*/
var validatePresenceOf = function(value) {
   return (this.provider && this.provider !== 'local') || (value && value.length);
};


/**
* Getter
*/
var escapeProperty = function(value) {
   return _.escape(value);
};


/**
* User Schema
*/

var UserSchema = new Schema({
   email: {
       type: String,
       required: true,
       unique: true,
   },
   hashed_password: {
       type: String,
       validate: [validatePresenceOf, 'Password cannot be blank']
   },
   surname: String,
   first_name: String,
   last_name: String,
   username: String,
   language: String,
   contact_no: Number,
   address: String,
   remember_token: String,
   business_id: String,
   is_cmmsn_agnt: Boolean,
   cmmsn_percent:Number,
   selected_contacts:String,
   deleted_at: Date,
   created_at: Date,
   updated_at: Date,
   salt: String,
   resetPasswordToken: String,
   resetPasswordExpires: Date,
   roles:String,
   isActivate:Boolean
});


/**
* Virtuals
*/
UserSchema.virtual('password').set(function(password) {
   this._password = password;
   this.salt = this.makeSalt();
   this.hashed_password = this.hashPassword(password);
}).get(function() {
   return this._password;
});


/**
* Pre-save hook
*/
UserSchema.pre('save', function(next) {
   if (this.isNew && this.provider == 'local' && this.password && !this.password.length)
       return next(new Error('Invalid password'));
   next();
});


/**
* Methods
*/
UserSchema.methods = {

   /**
    * Authenticate - check if the passwords are the same
    *
    * @param {String} plainText
    * @return {Boolean}
    * @api public
    */
   authenticate: function(plainText) {
       return this.hashPassword(plainText) == this.hashed_password;
   },

   /**
    * Make salt
    *
    * @return {String}
    * @api public
    */
   makeSalt: function() {
       return crypto.randomBytes(16).toString('base64');
   },

   /*
    * Hash password
    *
    * @param {String} password
    * @return {String}
    * @api public
    */
   hashPassword: function(password) {
       if (!password || !this.salt) return '';
       var salt = new Buffer(this.salt, 'base64');
       return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64');
   },

   /**
    * Hide security sensitive fields
    *
    * @returns {*|Array|Binary|Object}
    */
   toJSON: function() {
       var obj = this.toObject();
       delete obj.hashed_password;
       delete obj.salt;
       return obj;
   }
};

mongoose.model('users', UserSchema);



































