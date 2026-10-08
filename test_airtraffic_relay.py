from airtraffic_live_relay import in_bd, normalize

sample = {"ac": [
    {"hex":"abc123","flight":"BD123","lat":23.81,"lon":90.41,"alt_baro":12000,"gs":250,"track":45},
    {"hex":"def456","flight":"OUT","lat":40.0,"lon":-74.0,"alt_baro":12000,"gs":250,"track":45},
]}
rows = normalize(sample)
assert in_bd(23.81, 90.41)
assert not in_bd(40.0, -74.0)
assert len(rows) == 1 and rows[0]["hex"] == "abc123"
print("airtraffic relay self-test: PASS")
