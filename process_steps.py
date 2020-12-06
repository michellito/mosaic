import pandas as pd

participants = [
  # 'S001',
  'S002', 
  # 'S003', 
  # 'S004', 'S005',
  # 'S006', 'S007', 'S008', 'S009', 'S010',
  # 'S011', 'S012', 'S013', 'S014', 'S015',
  # 'S016', 'S017', 'S018', 'S019', 'S020',
  # 'S021', 'S022', 'S023', 'S024', 'S025',
  # 'S026', 'S027', 'S028', 'S029', 
  'S030',
]

for participant in participants:
    path = 'data/' + participant + '/' + participant + '_steps.csv'
    df = pd.read_csv(path, parse_dates=['Timestamp'], index_col=['Timestamp'])

    hourly = df.resample('H').sum()
    hourly.to_csv('data/' + participant + '/' + participant + '_hourly_steps.csv')
