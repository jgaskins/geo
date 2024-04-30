crystal_doc_search_index_callback({"repository_name":"geo","body":"# Geo\n\n![Crystal CI](https://github.com/geocrystal/geo/workflows/Crystal%20CI/badge.svg)\n[![GitHub release](https://img.shields.io/github/release/geocrystal/geo.svg)](https://github.com/geocrystal/geo/releases)\n[![Docs](https://img.shields.io/badge/docs-available-brightgreen.svg)](https://geocrystal.github.io/geo/)\n[![License](https://img.shields.io/github/license/geocrystal/geo.svg)](https://github.com/geocrystal/geo/blob/master/LICENSE)\n\nGeospatial primitives, algorithms, and utilities for Crystal.\n\n## Installation\n\nAdd this to your application's `shard.yml`:\n\n```yaml\ndependencies:\n  geo:\n    github: geocrystal/geo\n```\n\nRun `shards install`\n\n## Usage\n\nA `Geo::Coord` is a point in geographical coordinates: latitude and longitude.\n\n```crystal\nrequire \"geo\"\n\nc = Geo::Coord.new(50.004444, 36.231389)\n\nc.strfcoord(%{%latd %latm' %0.1lats\" %lath, %lngd %lngm' %0.1lngs\" %lngh})\n# => \"50 0' 16.0\" N, 36 13' 53.0\" E\"\n\nc.strfcoord(\"%lat,%lng\")\n# => \"-50.004444,-36.231389\"\n\nc.to_s\n# => \"50°0'16\"N 36°13'53\"E\"\n\npos = Geo::Coord.new(50.004444, 36.231389)\n\npos.geohash\n# => \"ubcu2rnbuxcx\"\n\npos.geohash(5)\n# => \"ubcu2\"\n```\n\n### Polygon\n\nA polygon represents an area enclosed by a closed path (or loop), which is defined by a series of coordinates.\n\n```crystal\nrequire \"geo\"\n\npos1 = Geo::Coord.new(45.3142533036254, -93.47527313511819)\npos2 = Geo::Coord.new(45.31232182518015, -93.34893036168069)\npos3 = Geo::Coord.new(45.23694281999268, -93.35167694371194)\npos4 = Geo::Coord.new(45.23500870841669, -93.47801971714944)\n\npolygon = Geo::Polygon.new([pos1, pos2, pos3, pos4])\n```\n\nThe Polygon in the example above consists of four sets of `Geo::Coord` coordinates, but notice that the first and last sets define the same location, which completes the loop. In practice, however, since polygons define closed areas, you don't need to specify the last set of coordinates. Ot will automatically complete the polygon by connecting the last location back to the first location.\n\nThe following example is identical to the previous one, except that the last `Geo::Coord` is omitted:\n\n```crystal\nrequire \"geo\"\n\npos1 = Geo::Coord.new(45.3142533036254, -93.47527313511819)\npos2 = Geo::Coord.new(45.31232182518015, -93.34893036168069)\npos3 = Geo::Coord.new(45.23694281999268, -93.35167694371194)\n\npolygon = Geo::Polygon.new([pos1, pos2, pos3])\n```\n\nAdditional actions:\n\n```crystal\ncoord_inside = Geo::Coord.new(45.27428243796789, -93.41648483416066)\ncoord_outside = Geo::Coord.new(45.45411010558687, -93.78151703160256)\n\npolygon.contains?(coord_inside)  # => true\npolygon.contains?(coord_outside) # => false\n\npolygon.centroid # => Geo::Coord(@lat=45.27463866133501, @lng=-93.41400121829719)\n```\n\nAdditionally you can initialize polygon as [convex hull](https://en.wikipedia.org/wiki/Convex_hull) from coordinates of points.\n\n```crystal\npoints = [\n  {1.0, 1.0},\n  {1.0, 0.0},\n  {1.0, -1.0},\n  {0.0, -1.0},\n  {-1.0, -1.0},\n  {-1.0, 0.0},\n  {-1.0, 1.0},\n  {0.0, 1.0},\n  {0.0, 0.0},\n].map { |point| Geo::Coord.new(point[0], point[1]) }\n\npolygon = Geo::Polygon.new(points, convex_hull: true)\npolygon.coords\n# => {-1.0, -1.0}, {1.0, -1.0}, {1.0, 1.0}, {-1.0, 1.0}, {-1.0, -1.0}\n```\n\nThe convex hull is computed using the [convex_hull](https://github.com/geocrystal/convex_hull) library.\n\n### Formatting\n\n`Geo::Coord#strfcoord` formats coordinates according to directives.\n\nEach directive starts with `%` and can contain some modifiers before its name.\n\nAcceptable modifiers:\n\n- unsigned integers: none;\n- signed integers: `+` for mandatory sign printing;\n- floats: same as integers and number of digits modifier, like `0.3`.\n\nList of directives:\n\n| Directive | Description                                 |\n| --------- | ------------------------------------------- |\n| `%lat`    | Full latitude, floating point, signed       |\n| `%latds`  | Latitude degrees, integer, signed           |\n| `%latd`   | Latitude degrees, integer, unsigned         |\n| `%latm`   | Latitude minutes, integer, unsigned         |\n| `%lats`   | Latitude seconds, floating point, unsigned  |\n| `%lath`   | Latitude hemisphere, \"N\" or \"S\"             |\n| `%lng`    | Full longitude, floating point, signed      |\n| `%lngds`  | Longitude degrees, integer, signed          |\n| `%lngd`   | Longitude degrees, integer, unsigned        |\n| `%lngm`   | Longitude minutes, integer, unsigned        |\n| `lngs`    | Longitude seconds, floating point, unsigned |\n| `%lngh`   | Longitude hemisphere, \"E\" or \"W\"            |\n\nExamples:\n\n```crystal\ng = Geo::Coord.new(50.004444, 36.231389)\ng.strfcoord('%+lat, %+lng')\n# => \"+50.004444, +36.231389\"\ng.strfcoord(\"%latd°%latm'%lath -- %lngd°%lngm'%lngh\")\n# => \"50°0'N -- 36°13'E\"\n```\n\n`strfcoord` handles seconds rounding implicitly:\n\n```crystal\npos = Geo::Coord.new(0.033333, 91.333333)\npos.strfcoord('%latd %latm %0.5lats') # => \"0 1 59.99880\"\npos.strfcoord('%latd %latm %lats')  # => \"0 2 0\"\n```\n\n### Calculate distances between two coords\n\nHaversine formula from [haversine](https://github.com/geocrystal/haversine) shard is used.\n\n```crystal\nrequire \"geo\"\nrequire \"geo/distance\"\n\nlondon = Geo::Coord.new(51.500153, -0.126236)\nnew_york = Geo::Coord.new(40.714268, -74.005974)\n\nnew_york.distance(london).to_kilometers\n# => 5570.4744596620685\n```\n\n### Calculates the location of a destination coord\n\n```crystal\nrequire \"geo\"\nrequire \"geo/distance\"\n\npoint = Geo::Coord.new(39, -75)\n\npoint.destination(5000, 90, :kilometers)\n# Geo::Coord(@lat=26.440010707631124, @lng=-22.885355549364313)\n```\n\n\n## Contributing\n\n1. Fork it (<https://github.com/geocrystal/geo/fork>)\n2. Create your feature branch (`git checkout -b my-new-feature`)\n3. Commit your changes (`git commit -am 'Add some feature'`)\n4. Push to the branch (`git push origin my-new-feature`)\n5. Create a new Pull Request\n\n## Contributors\n\n- [Anton Maminov](https://github.com/mamantoha) - creator and maintainer\n","program":{"html_id":"geo/toplevel","path":"toplevel.html","kind":"module","full_name":"Top Level Namespace","name":"Top Level Namespace","abstract":false,"locations":[],"repository_name":"geo","program":true,"enum":false,"alias":false,"const":false,"types":[{"html_id":"geo/Geo","path":"Geo.html","kind":"module","full_name":"Geo","name":"Geo","abstract":false,"locations":[{"filename":"lib/geo_bearing/src/geo_bearing.cr","line_number":1,"url":null},{"filename":"src/geo.cr","line_number":12,"url":null},{"filename":"src/geo/bearing.cr","line_number":1,"url":null},{"filename":"src/geo/coord.cr","line_number":1,"url":null},{"filename":"src/geo/distance.cr","line_number":1,"url":null},{"filename":"src/geo/polygon.cr","line_number":1,"url":null},{"filename":"src/geo/utils.cr","line_number":1,"url":null}],"repository_name":"geo","program":false,"enum":false,"alias":false,"const":false,"constants":[{"id":"DISTANCE_UNITS","name":"DISTANCE_UNITS","value":"Haversine::FACTORS.keys"},{"id":"VERSION","name":"VERSION","value":"{{ (`shards version /__w/geo/geo/src`).chomp.stringify }}"}],"types":[{"html_id":"geo/Geo/Coord","path":"Geo/Coord.html","kind":"struct","full_name":"Geo::Coord","name":"Coord","abstract":false,"superclass":{"html_id":"geo/Struct","kind":"struct","full_name":"Struct","name":"Struct"},"ancestors":[{"html_id":"geo/Comparable","kind":"module","full_name":"Comparable","name":"Comparable"},{"html_id":"geo/Struct","kind":"struct","full_name":"Struct","name":"Struct"},{"html_id":"geo/Value","kind":"struct","full_name":"Value","name":"Value"},{"html_id":"geo/Object","kind":"class","full_name":"Object","name":"Object"}],"locations":[{"filename":"src/geo/bearing.cr","line_number":2,"url":null},{"filename":"src/geo/coord.cr","line_number":3,"url":null},{"filename":"src/geo/distance.cr","line_number":2,"url":null}],"repository_name":"geo","program":false,"enum":false,"alias":false,"const":false,"constants":[{"id":"DIRECTIVES","name":"DIRECTIVES","value":"{/%(#{FLOATUFLAGS})?lats/ => ->(m : Regex::MatchData) do\n  \"%<lats>#{m[1]? || \"0.\"}f\"\nend, \"%latm\" => \"%<latm>i\", /%(#{INTFLAGS})?latds/ => ->(m : Regex::MatchData) do\n  \"%<latds>#{m[1]}i\"\nend, \"%latd\" => \"%<latd>i\", \"%lath\" => \"%<lath>s\", /%(#{FLOATFLAGS})?lat/ => ->(m : Regex::MatchData) do\n  \"%<lat>#{m[1]}f\"\nend, /%(#{FLOATUFLAGS})?lngs/ => ->(m : Regex::MatchData) do\n  \"%<lngs>#{m[1]? || \"0.\"}f\"\nend, \"%lngm\" => \"%<lngm>i\", /%(#{INTFLAGS})?lngds/ => ->(m : Regex::MatchData) do\n  \"%<lngds>#{m[1]}i\"\nend, \"%lngd\" => \"%<lngd>i\", \"%lngh\" => \"%<lngh>s\", /%(#{FLOATFLAGS})?lng/ => ->(m : Regex::MatchData) do\n  \"%<lng>#{m[1]}f\"\nend}"},{"id":"FLOATFLAGS","name":"FLOATFLAGS","value":"/\\+?#{FLOATUFLAGS}?/"},{"id":"FLOATUFLAGS","name":"FLOATUFLAGS","value":"/0\\.\\d+/"},{"id":"INTFLAGS","name":"INTFLAGS","value":"/\\+?/"}],"included_modules":[{"html_id":"geo/Comparable","kind":"module","full_name":"Comparable","name":"Comparable"}],"namespace":{"html_id":"geo/Geo","kind":"module","full_name":"Geo","name":"Geo"},"doc":"A `Coord` is a point in geographical coordinates: latitude and longitude.","summary":"<p>A <code><a href=\"../Geo/Coord.html\">Coord</a></code> is a point in geographical coordinates: latitude and longitude.</p>","constructors":[{"html_id":"new(lat:Number,lng:Number)-class-method","name":"new","abstract":false,"args":[{"name":"lat","external_name":"lat","restriction":"Number"},{"name":"lng","external_name":"lng","restriction":"Number"}],"args_string":"(lat : Number, lng : Number)","args_html":"(lat : <a href=\"../Geo/Coord/Number.html\">Number</a>, lng : <a href=\"../Geo/Coord/Number.html\">Number</a>)","location":{"filename":"src/geo/coord.cr","line_number":32,"url":null},"def":{"name":"new","args":[{"name":"lat","external_name":"lat","restriction":"Number"},{"name":"lng","external_name":"lng","restriction":"Number"}],"visibility":"Public","body":"_ = allocate\n_.initialize(lat, lng)\nif _.responds_to?(:finalize)\n  ::GC.add_finalizer(_)\nend\n_\n"}}],"instance_methods":[{"html_id":"<=>(other:Geo::Coord)-instance-method","name":"<=>","doc":"The comparison operator. Returns `0` if the two objects are equal,\na negative number if this object is considered less than *other*,\na positive number if this object is considered greater than *other*,\nor `nil` if the two objects are not comparable.\n\nSubclasses define this method to provide class-specific ordering.\n\nThe comparison operator is usually used to sort values:\n\n```\n# Sort in a descending way:\n[3, 1, 2].sort { |x, y| y <=> x } # => [3, 2, 1]\n\n# Sort in an ascending way:\n[3, 1, 2].sort { |x, y| x <=> y } # => [1, 2, 3]\n```","summary":"<p>The comparison operator.</p>","abstract":false,"args":[{"name":"other","external_name":"other","restriction":"Geo::Coord"}],"args_string":"(other : Geo::Coord)","args_html":"(other : <a href=\"../Geo/Coord.html\">Geo::Coord</a>)","location":{"filename":"src/geo/coord.cr","line_number":177,"url":null},"def":{"name":"<=>","args":[{"name":"other","external_name":"other","restriction":"Geo::Coord"}],"visibility":"Public","body":"ll <=> other.ll"}},{"html_id":"bearing(to:Geo::Coord,final=false):Float64-instance-method","name":"bearing","doc":"Calculates initial and final bearings between two points using great-circle distance formulas","summary":"<p>Calculates initial and final bearings between two points using great-circle distance formulas</p>","abstract":false,"args":[{"name":"to","external_name":"to","restriction":"Geo::Coord"},{"name":"final","default_value":"false","external_name":"final","restriction":""}],"args_string":"(to : Geo::Coord, final = false) : Float64","args_html":"(to : <a href=\"../Geo/Coord.html\">Geo::Coord</a>, final = <span class=\"n\">false</span>) : Float64","location":{"filename":"src/geo/bearing.cr","line_number":4,"url":null},"def":{"name":"bearing","args":[{"name":"to","external_name":"to","restriction":"Geo::Coord"},{"name":"final","default_value":"false","external_name":"final","restriction":""}],"return_type":"Float64","visibility":"Public","body":"Geo::Bearing.bearing(lat, lng, to.lat, to.lng, final)"}},{"html_id":"between?(p1:Geo::Coord,p2:Geo::Coord)-instance-method","name":"between?","abstract":false,"args":[{"name":"p1","external_name":"p1","restriction":"Geo::Coord"},{"name":"p2","external_name":"p2","restriction":"Geo::Coord"}],"args_string":"(p1 : Geo::Coord, p2 : Geo::Coord)","args_html":"(p1 : <a href=\"../Geo/Coord.html\">Geo::Coord</a>, p2 : <a href=\"../Geo/Coord.html\">Geo::Coord</a>)","location":{"filename":"src/geo/coord.cr","line_number":181,"url":null},"def":{"name":"between?","args":[{"name":"p1","external_name":"p1","restriction":"Geo::Coord"},{"name":"p2","external_name":"p2","restriction":"Geo::Coord"}],"visibility":"Public","body":"min, max = [p1, p2].minmax\nif cmp = self <=> min\n  if cmp < 0\n    return false\n  end\nend\nif cmp = self <=> max\n  if cmp > 0\n    return false\n  end\nend\ntrue\n"}},{"html_id":"destination(distance:Number,bearing:Number,unit:Symbol=:kilometers):Geo::Coord-instance-method","name":"destination","doc":"Calculates the location of a destination point","summary":"<p>Calculates the location of a destination point</p>","abstract":false,"args":[{"name":"distance","external_name":"distance","restriction":"Number"},{"name":"bearing","external_name":"bearing","restriction":"Number"},{"name":"unit","default_value":":kilometers","external_name":"unit","restriction":"Symbol"}],"args_string":"(distance : Number, bearing : Number, unit : Symbol = :kilometers) : Geo::Coord","args_html":"(distance : <a href=\"../Geo/Coord/Number.html\">Number</a>, bearing : <a href=\"../Geo/Coord/Number.html\">Number</a>, unit : Symbol = <span class=\"n\">:kilometers</span>) : <a href=\"../Geo/Coord.html\">Geo::Coord</a>","location":{"filename":"src/geo/distance.cr","line_number":10,"url":null},"def":{"name":"destination","args":[{"name":"distance","external_name":"distance","restriction":"Number"},{"name":"bearing","external_name":"bearing","restriction":"Number"},{"name":"unit","default_value":":kilometers","external_name":"unit","restriction":"Symbol"}],"return_type":"Geo::Coord","visibility":"Public","body":"point = Haversine.destination(self.ll, distance, bearing, unit)\nGeo::Coord.new(point[0], point[1])\n"}},{"html_id":"distance(other:Geo::Coord):Haversine::Distance-instance-method","name":"distance","doc":"Calculates distance to `other`.\nHaversine formula is used.","summary":"<p>Calculates distance to <code>other</code>.</p>","abstract":false,"args":[{"name":"other","external_name":"other","restriction":"Geo::Coord"}],"args_string":"(other : Geo::Coord) : Haversine::Distance","args_html":"(other : <a href=\"../Geo/Coord.html\">Geo::Coord</a>) : Haversine::Distance","location":{"filename":"src/geo/distance.cr","line_number":5,"url":null},"def":{"name":"distance","args":[{"name":"other","external_name":"other","restriction":"Geo::Coord"}],"return_type":"Haversine::Distance","visibility":"Public","body":"Haversine.distance(self.ll, other.ll)"}},{"html_id":"geohash(precision=12)-instance-method","name":"geohash","doc":"Returns a geohash representing coordinates.","summary":"<p>Returns a geohash representing coordinates.</p>","abstract":false,"args":[{"name":"precision","default_value":"12","external_name":"precision","restriction":""}],"args_string":"(precision = 12)","args_html":"(precision = <span class=\"n\">12</span>)","location":{"filename":"src/geo/coord.cr","line_number":155,"url":null},"def":{"name":"geohash","args":[{"name":"precision","default_value":"12","external_name":"precision","restriction":""}],"visibility":"Public","body":"Geohash.encode(lat.to_f, lng.to_f, precision)"}},{"html_id":"lat:Float32|Float64|Int32-instance-method","name":"lat","abstract":false,"location":{"filename":"src/geo/coord.cr","line_number":8,"url":null},"def":{"name":"lat","visibility":"Public","body":"@lat"}},{"html_id":"latd:Int32-instance-method","name":"latd","doc":"Returns latitude degrees","summary":"<p>Returns latitude degrees</p>","abstract":false,"location":{"filename":"src/geo/coord.cr","line_number":36,"url":null},"def":{"name":"latd","return_type":"Int32","visibility":"Public","body":"lat.abs.to_i"}},{"html_id":"latds-instance-method","name":"latds","abstract":false,"location":{"filename":"src/geo/coord.cr","line_number":75,"url":null},"def":{"name":"latds","visibility":"Public","body":"lat.to_i"}},{"html_id":"lath:String-instance-method","name":"lath","doc":"Returns latitude hemisphere","summary":"<p>Returns latitude hemisphere</p>","abstract":false,"location":{"filename":"src/geo/coord.cr","line_number":51,"url":null},"def":{"name":"lath","return_type":"String","visibility":"Public","body":"lat > 0 ? \"N\" : \"S\""}},{"html_id":"latm:Int32-instance-method","name":"latm","doc":"Returns latitude minutes","summary":"<p>Returns latitude minutes</p>","abstract":false,"location":{"filename":"src/geo/coord.cr","line_number":41,"url":null},"def":{"name":"latm","return_type":"Int32","visibility":"Public","body":"(lat.abs * 60).to_i % 60"}},{"html_id":"lats:Number-instance-method","name":"lats","doc":"Returns latitude seconds","summary":"<p>Returns latitude seconds</p>","abstract":false,"location":{"filename":"src/geo/coord.cr","line_number":46,"url":null},"def":{"name":"lats","return_type":"Number","visibility":"Public","body":"(lat.abs * 3600) % 60"}},{"html_id":"ll-instance-method","name":"ll","abstract":false,"location":{"filename":"src/geo/coord.cr","line_number":173,"url":null},"def":{"name":"ll","visibility":"Public","body":"{lat, lng}"}},{"html_id":"lng:Float32|Float64|Int32-instance-method","name":"lng","abstract":false,"location":{"filename":"src/geo/coord.cr","line_number":9,"url":null},"def":{"name":"lng","visibility":"Public","body":"@lng"}},{"html_id":"lngd:Int32-instance-method","name":"lngd","doc":"Returns longitude degrees","summary":"<p>Returns longitude degrees</p>","abstract":false,"location":{"filename":"src/geo/coord.cr","line_number":56,"url":null},"def":{"name":"lngd","return_type":"Int32","visibility":"Public","body":"lng.abs.to_i"}},{"html_id":"lngds-instance-method","name":"lngds","abstract":false,"location":{"filename":"src/geo/coord.cr","line_number":79,"url":null},"def":{"name":"lngds","visibility":"Public","body":"lng.to_i"}},{"html_id":"lngh:String-instance-method","name":"lngh","doc":"Returns longitude hemisphere","summary":"<p>Returns longitude hemisphere</p>","abstract":false,"location":{"filename":"src/geo/coord.cr","line_number":71,"url":null},"def":{"name":"lngh","return_type":"String","visibility":"Public","body":"lng > 0 ? \"E\" : \"W\""}},{"html_id":"lngm:Int32-instance-method","name":"lngm","doc":"Returns longitude minutes","summary":"<p>Returns longitude minutes</p>","abstract":false,"location":{"filename":"src/geo/coord.cr","line_number":61,"url":null},"def":{"name":"lngm","return_type":"Int32","visibility":"Public","body":"(lng.abs * 60).to_i % 60"}},{"html_id":"lngs:Number-instance-method","name":"lngs","doc":"Returns longitude seconds","summary":"<p>Returns longitude seconds</p>","abstract":false,"location":{"filename":"src/geo/coord.cr","line_number":66,"url":null},"def":{"name":"lngs","return_type":"Number","visibility":"Public","body":"(lng.abs * 3600) % 60"}},{"html_id":"strfcoord(formatstr):String-instance-method","name":"strfcoord","doc":"Formats coordinates according to directives in `formatstr`.\n\nEach directive starts with `%` and can contain some modifiers before its name.\n\nAcceptable modifiers:\n- unsigned integers: none;\n- signed integers: `+` for mandatory sign printing;\n- floats: same as integers and number of digits modifier, like `0.3`.\n\nList of directives:\n\n- `%lat`   - Full latitude, floating point, signed\n- `%latds` - Latitude degrees, integer, signed\n- `%latd`  - Latitude degrees, integer, unsigned\n- `%latm`  - Latitude minutes, integer, unsigned\n- `%lats`  - Latitude seconds, floating point, unsigned\n- `%lath`  - Latitude hemisphere, \"N\" or \"S\"\n- `%lng`   - Full longitude, floating point, signed\n- `%lngds` - Longitude degrees, integer, signed\n- `%lngd`  - Longitude degrees, integer, unsigned\n- `%lngm`  - Longitude minutes, integer, unsigned\n- `lngs`   - Longitude seconds, floating point, unsigned\n- `%lngh`` - Longitude hemisphere, \"E\" or \"W\"\n\nExamples:\n\n```\ng = Geo::Coord.new(50.004444, 36.231389)\ng.strfcoord('%+lat, %+lng')\n# => \"+50.004444, +36.231389\"\ng.strfcoord(\"%latd°%latm'%lath -- %lngd°%lngm'%lngh\")\n# => \"50°0'N -- 36°13'E\"\n```\n\n`strfcoord` handles seconds rounding implicitly:\n\n```\npos = Geo::Coord.new(0.033333, 91.333333)\npos.strfcoord('%latd %latm %0.5lats') # => \"0 1 59.99880\"\npos.strfcoord('%latd %latm %lats')  # => \"0 2 0\"\n```","summary":"<p>Formats coordinates according to directives in <code>formatstr</code>.</p>","abstract":false,"args":[{"name":"formatstr","external_name":"formatstr","restriction":""}],"args_string":"(formatstr) : String","args_html":"(formatstr) : String","location":{"filename":"src/geo/coord.cr","line_number":124,"url":null},"def":{"name":"strfcoord","args":[{"name":"formatstr","external_name":"formatstr","restriction":""}],"return_type":"String","visibility":"Public","body":"h = full_hash\nDIRECTIVES.reduce(formatstr) do |memo, __temp_52|\n  from, to = __temp_52\n  memo.gsub(from) do\n    to = if (to.is_a?(Proc) && from.is_a?(Regex)) && (match_data = memo.match(from))\n      to.call(match_data)\n    else\n      to.as(String)\n    end\n    res = to % h\n    if tmp = guard_seconds(to, res)\n      res, carrymin = tmp\n      if carrymin.empty?\n      else\n        if h[carrymin].is_a?(Int32)\n          tmp = h[carrymin].as(Int32)\n          h[carrymin] = tmp + 1\n        end\n      end\n    end\n    res\n  end\nend\n"}},{"html_id":"to_geojson:GeoJSON::Coordinates-instance-method","name":"to_geojson","abstract":false,"location":{"filename":"src/geo/coord.cr","line_number":159,"url":null},"def":{"name":"to_geojson","return_type":"GeoJSON::Coordinates","visibility":"Public","body":"GeoJSON::Coordinates.new(lng.to_f64, lat.to_f64)"}},{"html_id":"to_s(io)-instance-method","name":"to_s","doc":"Returns a string representing coordinates.\n\n```\ng.to_s             # => \"50°0'16\\\"N 36°13'53\\\"E\"\ng.to_s(dms: false) # => \"50.004444,36.231389\"\n```","summary":"<p>Returns a string representing coordinates.</p>","abstract":false,"args":[{"name":"io","external_name":"io","restriction":""}],"args_string":"(io)","args_html":"(io)","location":{"filename":"src/geo/coord.cr","line_number":169,"url":null},"def":{"name":"to_s","args":[{"name":"io","external_name":"io","restriction":""}],"visibility":"Public","body":"io << (strfcoord(\"%latd°%latm'%lats\\\"%lath %lngd°%lngm'%lngs\\\"%lngh\"))"}}],"types":[{"html_id":"geo/Geo/Coord/Number","path":"Geo/Coord/Number.html","kind":"alias","full_name":"Geo::Coord::Number","name":"Number","abstract":false,"locations":[{"filename":"src/geo/coord.cr","line_number":6,"url":null}],"repository_name":"geo","program":false,"enum":false,"alias":true,"aliased":"(Float32 | Float64 | Int32)","aliased_html":"Float32 | Float64 | Int32","const":false,"namespace":{"html_id":"geo/Geo/Coord","kind":"struct","full_name":"Geo::Coord","name":"Coord"}}]},{"html_id":"geo/Geo/Polygon","path":"Geo/Polygon.html","kind":"struct","full_name":"Geo::Polygon","name":"Polygon","abstract":false,"superclass":{"html_id":"geo/Struct","kind":"struct","full_name":"Struct","name":"Struct"},"ancestors":[{"html_id":"geo/Indexable","kind":"module","full_name":"Indexable","name":"Indexable"},{"html_id":"geo/Enumerable","kind":"module","full_name":"Enumerable","name":"Enumerable"},{"html_id":"geo/Iterable","kind":"module","full_name":"Iterable","name":"Iterable"},{"html_id":"geo/Struct","kind":"struct","full_name":"Struct","name":"Struct"},{"html_id":"geo/Value","kind":"struct","full_name":"Value","name":"Value"},{"html_id":"geo/Object","kind":"class","full_name":"Object","name":"Object"}],"locations":[{"filename":"src/geo/polygon.cr","line_number":5,"url":null}],"repository_name":"geo","program":false,"enum":false,"alias":false,"const":false,"included_modules":[{"html_id":"geo/Indexable","kind":"module","full_name":"Indexable","name":"Indexable"}],"namespace":{"html_id":"geo/Geo","kind":"module","full_name":"Geo","name":"Geo"},"doc":"A `Polygon` is a fixed-size, immutable, stack-allocated sequence of `Geo::Coord`.\nCoordinates are in lexicographical order.\nAdditionally, polygons form a closed loop and define a filled region.","summary":"<p>A <code><a href=\"../Geo/Polygon.html\">Polygon</a></code> is a fixed-size, immutable, stack-allocated sequence of <code><a href=\"../Geo/Coord.html\">Geo::Coord</a></code>.</p>","constructors":[{"html_id":"new(coords:Array(Geo::Coord),convex_hull=false)-class-method","name":"new","abstract":false,"args":[{"name":"coords","external_name":"coords","restriction":"Array(Geo::Coord)"},{"name":"convex_hull","default_value":"false","external_name":"convex_hull","restriction":""}],"args_string":"(coords : Array(Geo::Coord), convex_hull = false)","args_html":"(coords : Array(<a href=\"../Geo/Coord.html\">Geo::Coord</a>), convex_hull = <span class=\"n\">false</span>)","location":{"filename":"src/geo/polygon.cr","line_number":11,"url":null},"def":{"name":"new","args":[{"name":"coords","external_name":"coords","restriction":"Array(Geo::Coord)"},{"name":"convex_hull","default_value":"false","external_name":"convex_hull","restriction":""}],"visibility":"Public","body":"_ = allocate\n_.initialize(coords, convex_hull)\nif _.responds_to?(:finalize)\n  ::GC.add_finalizer(_)\nend\n_\n"}}],"instance_methods":[{"html_id":"==(other:Geo::Polygon):Bool-instance-method","name":"==","abstract":false,"args":[{"name":"other","external_name":"other","restriction":"Geo::Polygon"}],"args_string":"(other : Geo::Polygon) : Bool","args_html":"(other : <a href=\"../Geo/Polygon.html\">Geo::Polygon</a>) : Bool","location":{"filename":"src/geo/polygon.cr","line_number":93,"url":null},"def":{"name":"==","args":[{"name":"other","external_name":"other","restriction":"Geo::Polygon"}],"return_type":"Bool","visibility":"Public","body":"min_size = Math.min(size, other.size)\n0.upto(min_size - 1) do |i|\n  if self[i] == other[i]\n  else\n    return false\n  end\nend\nsize == other.size\n"}},{"html_id":"area:RingArea::Area-instance-method","name":"area","doc":"Return the approximate signed geodesic area of the polygon.","summary":"<p>Return the approximate signed geodesic area of the polygon.</p>","abstract":false,"location":{"filename":"src/geo/polygon.cr","line_number":29,"url":null},"def":{"name":"area","return_type":"RingArea::Area","visibility":"Public","body":"coordinates = @coords.map do |coord|\n  [coord.lng, coord.lat]\nend\nRingArea.ring_area(coordinates)\n"}},{"html_id":"centroid:Geo::Coord-instance-method","name":"centroid","abstract":false,"location":{"filename":"src/geo/polygon.cr","line_number":83,"url":null},"def":{"name":"centroid","return_type":"Geo::Coord","visibility":"Public","body":"@centroid || (@centroid = calculate_centroid)"}},{"html_id":"contains?(coord:Geo::Coord):Bool-instance-method","name":"contains?","abstract":false,"args":[{"name":"coord","external_name":"coord","restriction":"Geo::Coord"}],"args_string":"(coord : Geo::Coord) : Bool","args_html":"(coord : <a href=\"../Geo/Coord.html\">Geo::Coord</a>) : Bool","location":{"filename":"src/geo/polygon.cr","line_number":63,"url":null},"def":{"name":"contains?","args":[{"name":"coord","external_name":"coord","restriction":"Geo::Coord"}],"return_type":"Bool","visibility":"Public","body":"last_coord = @coords.last\nodd_nodes = false\ny, x = coord.ll\n@coords.each do |iter_coord|\n  yi, xi = iter_coord.ll\n  yj, xj = last_coord.ll\n  if (yi < y && yj >= y) || (yj < y && yi >= y)\n    if (xi + (((y - yi) / (yj - yi)) * (xj - xi))) < x\n      odd_nodes = !odd_nodes\n    end\n  end\n  last_coord = iter_coord\nend\nodd_nodes\n"}},{"html_id":"coords:Array(Geo::Coord)-instance-method","name":"coords","abstract":false,"location":{"filename":"src/geo/polygon.cr","line_number":24,"url":null},"def":{"name":"coords","visibility":"Public","body":"@coords"}},{"html_id":"size:Int32-instance-method","name":"size","doc":"Returns the number of elements in this container.","summary":"<p>Returns the number of elements in this container.</p>","abstract":false,"location":{"filename":"src/geo/polygon.cr","line_number":9,"url":null},"def":{"name":"size","return_type":"Int32","visibility":"Public","body":"@size"}},{"html_id":"to_geojson:GeoJSON::Polygon-instance-method","name":"to_geojson","abstract":false,"location":{"filename":"src/geo/polygon.cr","line_number":103,"url":null},"def":{"name":"to_geojson","return_type":"GeoJSON::Polygon","visibility":"Public","body":"coordinates = @coords.map do |coord|\n  GeoJSON::Coordinates.new(coord.lng.to_f64, coord.lat.to_f64)\nend\nGeoJSON::Polygon.new([coordinates])\n"}},{"html_id":"unsafe_fetch(index:Int)-instance-method","name":"unsafe_fetch","doc":"Returns the element at the given *index*, without doing any bounds check.\n\n`Indexable` makes sure to invoke this method with *index* in `0...size`,\nso converting negative indices to positive ones is not needed here.\n\nClients never invoke this method directly. Instead, they access\nelements with `#[](index)` and `#[]?(index)`.\n\nThis method should only be directly invoked if you are absolutely\nsure the index is in bounds, to avoid a bounds check for a small boost\nof performance.","summary":"<p>Returns the element at the given <em>index</em>, without doing any bounds check.</p>","abstract":false,"args":[{"name":"index","external_name":"index","restriction":"Int"}],"args_string":"(index : Int)","args_html":"(index : Int)","location":{"filename":"src/geo/polygon.cr","line_number":89,"url":null},"def":{"name":"unsafe_fetch","args":[{"name":"index","external_name":"index","restriction":"Int"}],"visibility":"Public","body":"@coords[index]"}}]},{"html_id":"geo/Geo/Utils","path":"Geo/Utils.html","kind":"module","full_name":"Geo::Utils","name":"Utils","abstract":false,"locations":[{"filename":"src/geo/utils.cr","line_number":2,"url":null}],"repository_name":"geo","program":false,"enum":false,"alias":false,"const":false,"extended_modules":[{"html_id":"geo/Geo/Utils","kind":"module","full_name":"Geo::Utils","name":"Utils"}],"namespace":{"html_id":"geo/Geo","kind":"module","full_name":"Geo","name":"Geo"},"instance_methods":[{"html_id":"orientation(p:Geo::Coord,q:Geo::Coord,r:Geo::Coord)-instance-method","name":"orientation","doc":"Orientation of ordered triplet (p, q, r)\n\nOrientation of an ordered triplet of points in the plane can be\n\n* counterclockwise\n* clockwise\n* colinear\n\nThe function returns following values\n0 --> p, q and r are colinear\n1 --> Clockwise\n2 --> Counterclockwise","summary":"<p>Orientation of ordered triplet (p, q, r)</p>","abstract":false,"args":[{"name":"p","external_name":"p","restriction":"Geo::Coord"},{"name":"q","external_name":"q","restriction":"Geo::Coord"},{"name":"r","external_name":"r","restriction":"Geo::Coord"}],"args_string":"(p : Geo::Coord, q : Geo::Coord, r : Geo::Coord)","args_html":"(p : <a href=\"../Geo/Coord.html\">Geo::Coord</a>, q : <a href=\"../Geo/Coord.html\">Geo::Coord</a>, r : <a href=\"../Geo/Coord.html\">Geo::Coord</a>)","location":{"filename":"src/geo/utils.cr","line_number":17,"url":null},"def":{"name":"orientation","args":[{"name":"p","external_name":"p","restriction":"Geo::Coord"},{"name":"q","external_name":"q","restriction":"Geo::Coord"},{"name":"r","external_name":"r","restriction":"Geo::Coord"}],"visibility":"Public","body":"val = ((q.lng - p.lng) * (r.lat - q.lat)) - ((q.lat - p.lat) * (r.lng - q.lng))\nif val == 0\n  return 0\nend\nval > 0 ? 1 : 2\n"}}]}]}]}})