#Function creates 500 requests for statistics and prints results

import json,httplib
import time

connection = httplib.HTTPSConnection('api.parse.com', 443)
connection.connect()

for x in range(0, 500):
	connection.request('POST', '/1/functions/getStats', json.dumps({
			#Change userId below
			#Current user is Simon Quach
			"userId" : "njA57Ez7O6"
		 }), {
		   "X-Parse-Application-Id": "nTERmyCRrA1y3B8LhGQiXP38lx8wu2Mrdtpppwhr",
		   "X-Parse-REST-API-Key": "1Az1TpnkQqOue9tupaH9jyJNnP5OEoOLfBDBeoXd",
		   "Content-Type": "application/json"
		 })
	result = json.loads(connection.getresponse().read())
	print result

