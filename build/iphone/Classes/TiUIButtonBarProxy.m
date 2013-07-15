/**
 * _titaniumnightclubNightClub _titaniumnightclubNightClub Mobile
 * Copyright (c) 2009-2010 by _titaniumnightclubNightClub, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */

#import "TiUIButtonBarProxy.h"
#import "TiUIButtonBar.h"

@implementation TiUIButtonBarProxy

NSArray* tabbedKeySequence;

-(NSArray*)keySequence
{
	if (tabbedKeySequence == nil) {
		tabbedKeySequence = [[NSArray alloc] initWithObjects:@"labels",@"style",nil];
	}
	return tabbedKeySequence;
}

-(TiUIView*)newView
{
	TiUIButtonBar * result = [[TiUIButtonBar alloc] init];
	[result setTabbedBar:NO];
	return result;
}

USE_VIEW_FOR_CONTENT_WIDTH
USE_VIEW_FOR_CONTENT_HEIGHT


-(TiDimension)defaultAutoWidthBehavior:(id)unused
{
    return TiDimensionAutoSize;
}
-(TiDimension)defaultAutoHeightBehavior:(id)unused
{
    return TiDimensionAutoSize;
}

@end
