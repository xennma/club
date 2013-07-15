/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2013 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 * WARNING: This is generated code. Do not modify. Your changes *will* be lost.
 */

#import <Foundation/Foundation.h>
#import "TiUtils.h"
#import "ApplicationDefaults.h"

@implementation ApplicationDefaults

+ (NSMutableDictionary*) copyDefaults
{
	NSMutableDictionary * _property = [[NSMutableDictionary alloc] init];
	
	[_property setObject:[TiUtils stringValue:@"q0yxWunXbgirg2huonOf3qQ9XeNKbN6P"] forKey:@"acs-oauth-secret-production"];
	[_property setObject:[TiUtils stringValue:@"FnUyln3s5IzWX5GdliXEZPV16UVLl6SG"] forKey:@"acs-oauth-key-production"];
	[_property setObject:[TiUtils stringValue:@"eEuV0Xk3EqEH5j5rtGSJCA6xkD6NLitp"] forKey:@"acs-api-key-production"];
	[_property setObject:[TiUtils stringValue:@"GQlFIVjXhR8cuAFeSEe2gEiJxJ4aYbRR"] forKey:@"acs-oauth-secret-development"];
	[_property setObject:[TiUtils stringValue:@"SLDLriK6LciduPSEuhyPB8IZn2O8Q7dO"] forKey:@"acs-oauth-key-development"];
	[_property setObject:[TiUtils stringValue:@"eWhc5D7ImLG3Fp1GeuCF7l4kwn80cAgW"] forKey:@"acs-api-key-development"];
	[_property setObject:[TiUtils stringValue:@"system"] forKey:@"ti.ui.defaultunit"];
	return _property;
}

+ (NSDictionary*) launchUrl {
    static BOOL launched = NO;
    if (!launched) {
        launched = YES;
        return nil;
    } else { return nil;}
}
 
@end