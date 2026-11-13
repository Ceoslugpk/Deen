//
//  Declares the module to React Native. The implementation is in Swift.
//
//  Written in Objective-C rather than Swift so that it needs no bridging
//  header of its own to be declared: this file can see React's types directly,
//  and the Swift half sees them through the app's bridging header.
//
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(DeenWidgetBridge, NSObject)

RCT_EXTERN_METHOD(publish:(NSString *)json
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(refresh:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(read:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(clear:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(startActivity:(NSString *)name
                  time:(NSString *)time
                  nextAt:(double)nextAt
                  place:(NSString *)place
                  method:(NSString *)method
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopActivity:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
