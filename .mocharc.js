module.exports = {
	'harmony': true,
	'sort': true,
	'require': 'ts-node/register',
	'extension': ['ts', 'tsx'],
	'exit': true, // This is a temporary workaround, until we figure out why mocha hangs
}
