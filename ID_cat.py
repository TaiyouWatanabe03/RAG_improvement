# # import boto3
# # from botocore.session import get_session

# # for profile in get_session().available_profiles:
# #     try:
# #         session = boto3.Session(profile_name=profile)
# #         sts = session.client('sts')
# #         account = sts.get_caller_identity()['Account']
# #         print(f"{profile}: {account}")
# #     except Exception as e:
# #         print(f"{profile}: エラー - {e}")

# import boto3
# from botocore.session import get_session

# for prfile in get_session().available_profiles:
#     try:
#         session = boto3.Session(profile_name=profile)
#         sts = session.client('sts')
#         account =  sts.get_caller_identity(['Account'])
#         print(f"{profile}:{account}")
#     except Excepyion as e:
#         print






import boto3

sts = boto3.client('sts')

id = sts.get_caller_identity()
# print(id)

print("アカウントID:", id['Account'])